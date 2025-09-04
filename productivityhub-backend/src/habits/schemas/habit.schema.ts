import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HabitDocument = Habit & Document;

@Schema({ timestamps: true })
export class Habit {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ default: 'daily' })
  frequency: string; // 'daily', 'weekly', 'monthly'

  @Prop({ default: 0 })
  streak: number;

  @Prop({ default: [] })
  completedDates: Date[];

  @Prop()
  category: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);