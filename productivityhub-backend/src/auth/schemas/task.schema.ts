import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ trim: true, maxlength: 1000 })
  description: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  dueDate: Date;

  @Prop({ 
    default: 'medium', 
    enum: ['low', 'medium', 'high'] 
  })
  priority: string;

  @Prop({ trim: true, maxlength: 50 })
  category: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop()
  reminder: Date;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);