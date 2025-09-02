import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        await Promise.resolve();
        const uri = configService.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/productivityhub',
        );
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    HabitsModule,
    TasksModule,
    NotesModule,
  ],
})
export class AppModule {}
