import { Module } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
	providers: [CommentsService, PrismaService, NotificationService],
	controllers: [CommentsController],
})
export class CommentsModule {}
