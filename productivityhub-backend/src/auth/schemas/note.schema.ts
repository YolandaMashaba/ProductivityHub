import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: false })
  isPinned: boolean;

  @Prop()
  notebook: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

// Add indexes for better query performance
NoteSchema.index({ userId: 1, isPinned: -1 });
NoteSchema.index({ userId: 1, tags: 1 });
NoteSchema.index({ userId: 1, notebook: 1 });