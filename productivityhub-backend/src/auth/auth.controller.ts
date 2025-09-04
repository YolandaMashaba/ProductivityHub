import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface RequestUser {
  userId: string;
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User Registration Endpoint
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.authService.register(createUserDto);
      return {
        success: true,
        message: result.message,
        data: result.user,
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  }

  // User Login Endpoint
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const result = await this.authService.login(loginUserDto);
      return {
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  }

  // Get User Profile (Protected Route)
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: { user: RequestUser }) {
    try {
      const user = await this.authService.getProfile(req.user.userId);
      return {
        success: true,
        message: 'Profile retrieved successfully',
        data: user,
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        message: err.message,
        data: null,
      };
    }
  }

  // Health Check Endpoint
  @Get('health')
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return {
      success: true,
      message: 'Auth service is running',
      timestamp: new Date().toISOString(),
    };
  }
}
