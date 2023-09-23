import { NotFoundException } from '@nestjs/common/exceptions';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TCommentDto } from './schemas/comment';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
	constructor(private prismaService: PrismaService) {}

	private commentsInclude = {
		user: {
			select: {
				id: true,
				role: true,
				email: true,
				profile: true,
			},
		},
	};

	async createOne({
		comment,
		userId,
		articleId,
	}: {
		comment: TCommentDto;
		userId: number | undefined;
		articleId: number;
	}) {
		try {
			return await this.prismaService.comment.create({
				data: {
					...comment,
					article: {
						connect: { id: articleId },
					},
					user: {
						connect: {
							id: userId,
						},
					},
				},
				include: this.commentsInclude,
			});
		} catch (error) {
			throw new NotFoundException('Article not found');
		}
	}

	getAll(args: Prisma.CommentFindManyArgs) {
		return this.prismaService.comment.findMany({
			where: args.where,
			include: this.commentsInclude,
		});
	}

	findOne({ id }: { id: number }) {
		return this.prismaService.comment.findFirst({
			where: { id },
			include: this.commentsInclude,
		});
	}

	updateOne({ id, text }: { id: number; text: string }) {
		return this.prismaService.comment.update({
			where: { id },
			data: {
				text,
			},
			include: this.commentsInclude,
		});
	}

	deleteOne({ id }: { id: number }) {
		return this.prismaService.comment.delete({
			where: { id },
			include: this.commentsInclude,
		});
	}
}
