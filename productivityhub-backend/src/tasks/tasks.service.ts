import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '../auth/schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = new this.taskModel({
      ...createTaskDto,
      userId: new Types.ObjectId(userId),
    });
    return task.save();
  }

  async findAll(userId: string, filters?: { completed?: boolean }): Promise<Task[]> {
    const query: any = { userId: new Types.ObjectId(userId) };
    
    if (filters?.completed !== undefined) {
      query.completed = filters.completed;
    }

    return this.taskModel
      .find(query)
      .sort({ dueDate: 1, priority: -1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      updateTaskDto,
      { new: true },
    );

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.taskModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async toggleComplete(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.completed = !task.completed;
    
    // Update progress based on completion
    if (task.completed) {
      task.progress = 100;
    } else if (task.progress === 100) {
      task.progress = 0;
    }

    return task.save();
  }

  async getUpcomingTasks(userId: string, days: number = 7): Promise<Task[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return this.taskModel
      .find({
        userId: new Types.ObjectId(userId),
        dueDate: { $gte: startDate, $lte: endDate },
        completed: false,
      })
      .sort({ dueDate: 1, priority: -1 })
      .exec();
  }
}
