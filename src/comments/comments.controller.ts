import { Delete } from '@nestjs/common/decorators';
import { ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { Body, Controller, Param, ParseIntPipe, Post, UseGuards, Request, Get, Patch } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/user/schemas/user.dto';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { CommentsService } from './comments.service';
import { commentSchema, TCommentDto } from './schemas/comment';

@Controller('comments')
export class CommentsController {
	constructor(private commentsService: CommentsService) {}

	@Post('article/:articleId')
	@UseGuards(AuthGuard)
	async comment(
		@Param('articleId', ParseIntPipe) articleId: number,
		@Body(new ZodValidationPipe(commentSchema)) dto: TCommentDto,
		@Request() req: RequestWithUser,
	) {
		return await this.commentsService.createOne({ articleId, userId: req.user?.id, comment: dto });
	}

	@Get('article/:articleId')
	async getAllByArticleId(@Param('articleId', ParseIntPipe) articleId: number) {
		return await this.commentsService.getAll({ where: { articleId } });
	}

	@Patch(':id')
	@UseGuards(AuthGuard)
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(commentSchema)) dto: TCommentDto,
		@Request() { user }: RequestWithUser,
	) {
		const updated = await this.commentsService.findOne({ id });

		if (!updated) {
			throw new NotFoundException('Comment not found');
		}

		if (user?.id !== updated?.userId && user?.role !== 'admin') {
			throw new ForbiddenException();
		}

		return await this.commentsService.updateOne({ id, text: dto.text });
	}

	@Get('user/:userId')
	getAllByUserId(@Param('userId', ParseIntPipe) id: number) {
		return this.commentsService.getAll({ where: { userId: id } });
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	async delete(@Param('id', ParseIntPipe) id: number, @Request() { user }: RequestWithUser) {
		const deleted = await this.commentsService.findOne({ id });

		if (!deleted) {
			throw new NotFoundException('Comment not found');
		}

		if (user?.id !== deleted?.userId && user?.role !== 'admin') {
			throw new ForbiddenException();
		}

		return await this.commentsService.deleteOne({ id });
	}
}
