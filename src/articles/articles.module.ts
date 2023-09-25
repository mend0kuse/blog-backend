import { Module } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
	controllers: [ArticlesController],
	providers: [ArticlesService, PrismaService, NotificationService],
})
export class ArticlesModule {}
