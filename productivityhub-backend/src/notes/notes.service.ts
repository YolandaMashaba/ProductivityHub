import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note, NoteDocument } from '../auth/schemas/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const note = new this.noteModel({
      ...createNoteDto,
      userId: new Types.ObjectId(userId),
    });
    return note.save();
  }

  async findAll(
    userId: string, 
    filters?: { notebook?: string; tag?: string; isPinned?: boolean }
  ): Promise<Note[]> {
    const query: any = { userId: new Types.ObjectId(userId) };
    
    if (filters?.notebook) {
      query.notebook = filters.notebook;
    }
    
    if (filters?.tag) {
      query.tags = filters.tag;
    }
    
    if (filters?.isPinned !== undefined) {
      query.isPinned = filters.isPinned;
    }

    return this.noteModel
      .find(query)
      .sort({ isPinned: -1, updatedAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.noteModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
    
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    
    return note;
  }

  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<Note> {
    const note = await this.noteModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      updateNoteDto,
      { new: true },
    );

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.noteModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Note not found');
    }
  }

  async searchNotes(userId: string, searchTerm: string): Promise<Note[]> {
    return this.noteModel
      .find({
        userId: new Types.ObjectId(userId),
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { content: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async togglePin(id: string, userId: string): Promise<Note> {
    const note = await this.noteModel.findOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    note.isPinned = !note.isPinned;
    return note.save();
  }

  async getNotebooks(userId: string): Promise<string[]> {
    const notebooks = await this.noteModel
      .distinct('notebook', { userId: new Types.ObjectId(userId) })
      .exec();
    
    return notebooks.filter(notebook => notebook !== null && notebook !== '');
  }

  async getTags(userId: string): Promise<string[]> {
    const notes = await this.noteModel
      .find({ userId: new Types.ObjectId(userId) })
      .select('tags')
      .exec();
    
    const allTags = notes.flatMap(note => note.tags);
    return Array.from(new Set(allTags)).filter(tag => tag !== '');
  }
}
