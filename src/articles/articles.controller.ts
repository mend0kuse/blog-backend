import { isAuthor } from './helpers/is-author';
import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { Body, Delete, Param, Patch, Post, Query, Request, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/user/schemas/user.dto';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { ArticlesService } from './articles.service';
import {
	articleDtoCreate,
	articleDtoUpdate,
	TArticleDtoCreate,
	TArticleDtoUpdate,
	TArticleWithUser,
} from './schemas/article';
import { articleQuery, TArticleQuery } from './schemas/articleQuery';
import { NotificationService } from 'src/notification/notification.service';

@Controller('articles')
export class ArticlesController {
	constructor(
		private readonly articlesService: ArticlesService,
		private readonly notificationsService: NotificationService,
	) {}

	@Get()
	@UsePipes(new ZodValidationPipe(articleQuery))
	getAll(@Query() query: TArticleQuery) {
		return this.articlesService.getAll(query);
	}

	@Get(':id')
	async getOneById(@Param('id', ParseIntPipe) id: number) {
		const founded = await this.articlesService.getOne(id);

		if (!founded) {
			throw new NotFoundException();
		}

		await this.articlesService.update({ id, dto: { views: founded.views + 1 } });

		return founded;
	}

	@Patch(':id/like')
	@UseGuards(AuthGuard)
	async like(@Param('id', ParseIntPipe) id: number, @Request() req: RequestWithUser) {
		const liked = await this.articlesService.like(id);

		if (!liked) {
			throw new NotFoundException();
		}

		await this.notificationsService.createOne({ articleId: id, type: 'like', userId: req.user?.id });

		return liked;
	}

	@Patch(':id/dislike')
	@UseGuards(AuthGuard)
	async dislike(@Param('id', ParseIntPipe) id: number, @Request() req: RequestWithUser) {
		const disliked = await this.articlesService.dislike(id);

		if (!disliked) {
			throw new NotFoundException();
		}

		await this.notificationsService.createOne({ articleId: id, type: 'dislike', userId: req.user?.id });

		return disliked;
	}

	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new ZodValidationPipe(articleDtoCreate))
	create(@Body() dto: TArticleDtoCreate, @Request() req: RequestWithUser) {
		return this.articlesService.createOne(dto, req.user?.id);
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	async delete(@Param('id', ParseIntPipe) id: number, @Request() req: RequestWithUser) {
		const deletedArticle = await this.articlesService.getOne(id);

		if (!deletedArticle) {
			throw new NotFoundException();
		}

		isAuthor(req.user, deletedArticle as TArticleWithUser);

		return this.articlesService.deleteOne(id);
	}

	@Patch(':id')
	@UseGuards(AuthGuard)
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(articleDtoUpdate)) dto: TArticleDtoUpdate,
	) {
		return this.articlesService.update({ id, dto });
	}
}
