import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TCreateNotification } from './schemas/notification';

@Injectable()
export class NotificationService {
	constructor(private prismaService: PrismaService) {}

	private include = {
		user: true,
	};

	createOne(data: TCreateNotification) {
		return this.prismaService.notification.create({
			data: {
				type: data.type,
				article: {
					connect: {
						id: data.articleId,
					},
				},
				...(data.userId && {
					user: {
						connect: {
							id: data.userId,
						},
					},
				}),
			},
			include: this.include,
		});
	}

	delete(ids: number[]) {
		return this.prismaService.notification.deleteMany({
			where: {
				id: { in: ids },
			},
		});
	}
}
