import { 
    Controller, 
    Post, 
    Body, 
    Get, 
    Param, 
    Patch, 
    Delete, 
    UseGuards, 
    Request,
    HttpCode,
    HttpStatus,
    Query
  } from '@nestjs/common';
  import { NotesService } from './notes.service';
  import { CreateNoteDto } from './dto/create-note.dto';
  import { UpdateNoteDto } from './dto/update-note.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('notes')
  @UseGuards(JwtAuthGuard)
  export class NotesController {
    constructor(private readonly notesService: NotesService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
      try {
        const note = await this.notesService.create(createNoteDto, req.user.userId);
        return {
          success: true,
          message: 'Note created successfully',
          data: note
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
      @Request() req,
      @Query('notebook') notebook?: string,
      @Query('tag') tag?: string,
      @Query('pinned') pinned?: string
    ) {
      try {
        const filters: any = {};
        
        if (notebook) filters.notebook = notebook;
        if (tag) filters.tag = tag;
        if (pinned !== undefined) filters.isPinned = pinned === 'true';
  
        const notes = await this.notesService.findAll(req.user.userId, filters);
        return {
          success: true,
          message: 'Notes retrieved successfully',
          data: notes
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    @Get('search')
    @HttpCode(HttpStatus.OK)
    async search(@Request() req, @Query('q') searchTerm: string) {
      try {
        const notes = await this.notesService.searchNotes(req.user.userId, searchTerm);
        return {
          success: true,
          message: 'Search completed successfully',
          data: notes
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string, @Request() req) {
      try {
        const note = await this.notesService.findOne(id, req.user.userId);
        return {
          success: true,
          message: 'Note retrieved successfully',
          data: note
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
      @Param('id') id: string,
      @Body() updateNoteDto: UpdateNoteDto,
      @Request() req
    ) {
      try {
        const note = await this.notesService.update(id, updateNoteDto, req.user.userId);
        return {
          success: true,
          message: 'Note updated successfully',
          data: note
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string, @Request() req) {
      try {
        await this.notesService.remove(id, req.user.userId);
        return {
          success: true,
          message: 'Note deleted successfully',
          data: null
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    @Post(':id/toggle-pin')
    @HttpCode(HttpStatus.OK)
    async togglePin(@Param('id') id: string, @Request() req) {
      try {
        const note = await this.notesService.togglePin(id, req.user.userId);
        const status = note.isPinned ? 'pinned' : 'unpinned';
        return {
          success: true,
          message: `Note ${status} successfully`,
          data: note
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    @Get('metadata/notebooks')
    @HttpCode(HttpStatus.OK)
    async getNotebooks(@Request() req) {
      try {
        const notebooks = await this.notesService.getNotebooks(req.user.userId);
        return {
          success: true,
          message: 'Notebooks retrieved successfully',
          data: notebooks
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    @Get('metadata/tags')
    @HttpCode(HttpStatus.OK)
    async getTags(@Request() req) {
      try {
        const tags = await this.notesService.getTags(req.user.userId);
        return {
          success: true,
          message: 'Tags retrieved successfully',
          data: tags
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  }
