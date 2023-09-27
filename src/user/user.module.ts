import { PrismaService } from 'src/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, NotificationService],
	exports: [UserService],
})
export class UserModule {}
