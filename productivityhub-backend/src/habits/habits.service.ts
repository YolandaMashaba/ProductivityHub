import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Habit, HabitDocument } from './schemas/habit.schema';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<HabitDocument>,
  ) {}

  async create(createHabitDto: CreateHabitDto, userId: string): Promise<Habit> {
    const habit = new this.habitModel({
      ...createHabitDto,
      userId: new Types.ObjectId(userId),
    });
    return habit.save();
  }

  async findAll(userId: string): Promise<Habit[]> {
    return this.habitModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Habit> {
    const habit = await this.habitModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
    
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }
    
    return habit;
  }

  async update(
    id: string,
    updateHabitDto: UpdateHabitDto,
    userId: string,
  ): Promise<Habit> {
    const habit = await this.habitModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      updateHabitDto,
      { new: true },
    );

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return habit;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.habitModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Habit not found');
    }
  }

  async markComplete(id: string, userId: string): Promise<Habit> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const habit = await this.habitModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    // Check if already completed today
    const alreadyCompleted = habit.completedDates.some(
      (date) => date.toDateString() === today.toDateString(),
    );

    if (!alreadyCompleted) {
      habit.completedDates.push(today);
      habit.streak += 1;
    } else {
      // Remove today's completion
      habit.completedDates = habit.completedDates.filter(
        (date) => date.toDateString() !== today.toDateString(),
      );
      habit.streak = Math.max(0, habit.streak - 1);
    }

    return habit.save();
  }
}