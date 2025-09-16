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
    HttpStatus 
  } from '@nestjs/common';
  import { HabitsService } from './habits.service';
  import { CreateHabitDto } from './dto/create-habit.dto';
  import { UpdateHabitDto } from './dto/update-habit.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('habits')
  @UseGuards(JwtAuthGuard)
  export class HabitsController {
    constructor(private readonly habitsService: HabitsService) {}
  
    // Create a new habit
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createHabitDto: CreateHabitDto, @Request() req) {
      try {
        const habit = await this.habitsService.create(createHabitDto, req.user.userId);
        return {
          success: true,
          message: 'Habit created successfully',
          data: habit
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    // Get all habits for the authenticated user
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Request() req) {
      try {
        const habits = await this.habitsService.findAll(req.user.userId);
        return {
          success: true,
          message: 'Habits retrieved successfully',
          data: habits
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    // Get a specific habit
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string, @Request() req) {
      try {
        const habit = await this.habitsService.findOne(id, req.user.userId);
        return {
          success: true,
          message: 'Habit retrieved successfully',
          data: habit
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    // Update a habit
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(
      @Param('id') id: string,
      @Body() updateHabitDto: UpdateHabitDto,
      @Request() req
    ) {
      try {
        const habit = await this.habitsService.update(id, updateHabitDto, req.user.userId);
        return {
          success: true,
          message: 'Habit updated successfully',
          data: habit
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: null
        };
      }
    }
  
    // Delete a habit
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id') id: string, @Request() req) {
      try {
        await this.habitsService.remove(id, req.user.userId);
        return {
          success: true,
          message: 'Habit deleted successfully',
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
  
    // Mark habit as complete/incomplete for today
    @Post(':id/complete')
    @HttpCode(HttpStatus.OK)
    async markComplete(@Param('id') id: string, @Request() req) {
      try {
        const habit = await this.habitsService.markComplete(id, req.user.userId);
        const action = habit.completedDates.some(
          date => date.toDateString() === new Date().toDateString()
        ) ? 'completed' : 'incomplete';
        
        return {
          success: true,
          message: `Habit marked as ${action}`,
          data: habit
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