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
  import { TasksService } from './tasks.service';
  import { CreateTaskDto } from './dto/create-task.dto';
  import { UpdateTaskDto } from './dto/update-task.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('tasks')
  @UseGuards(JwtAuthGuard)
  export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
  
    // Create a new task
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
      try {
        const task = await this.tasksService.create(createTaskDto, req.user.userId);
        return {
          success: true,
          message: 'Task created successfully',
          data: task
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    // Get all tasks for the authenticated user
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
      @Request() req,
      @Query('completed') completed?: string
    ) {
      try {
        const filters: any = {};
        
        if (completed !== undefined) {
          filters.completed = completed === 'true';
        }
  
        const tasks = await this.tasksService.findAll(req.user.userId, filters);
        return {
          success: true,
          message: 'Tasks retrieved successfully',
          data: tasks
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    // Get a specific task
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string, @Request() req) {
      try {
        const task = await this.tasksService.findOne(id, req.user.userId);
        return {
          success: true,
          message: 'Task retrieved successfully',
          data: task
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    // Update a task
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
      @Param('id') id: string,
      @Body() updateTaskDto: UpdateTaskDto,
      @Request() req
    ) {
      try {
        const task = await this.tasksService.update(id, updateTaskDto, req.user.userId);
        return {
          success: true,
          message: 'Task updated successfully',
          data: task
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    // Delete a task
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string, @Request() req) {
      try {
        await this.tasksService.remove(id, req.user.userId);
        return {
          success: true,
          message: 'Task deleted successfully',
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
  
    // Toggle task completion status
    @Post(':id/toggle-complete')
    @HttpCode(HttpStatus.OK)
    async toggleComplete(@Param('id') id: string, @Request() req) {
      try {
        const task = await this.tasksService.toggleComplete(id, req.user.userId);
        const status = task.completed ? 'completed' : 'incomplete';
        return {
          success: true,
          message: `Task marked as ${status}`,
          data: task
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    // Get upcoming tasks (next 7 days by default)
    @Get('upcoming/:days?')
    @HttpCode(HttpStatus.OK)
    async getUpcomingTasks(
      @Param('days') days: string,
      @Request() req
    ) {
      try {
        const daysNumber = days ? parseInt(days) : 7;
        const tasks = await this.tasksService.getUpcomingTasks(req.user.userId, daysNumber);
        return {
          success: true,
          message: `Upcoming tasks for next ${daysNumber} days retrieved successfully`,
          data: tasks
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
