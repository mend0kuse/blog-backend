import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { Body, Delete, Param, Patch, Post, Query, Request, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/user/schemas/user.dto';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { ArticlesService } from './articles.service';
import { articleDtoCreate, articleDtoUpdate, TArticleDtoCreate, TArticleDtoUpdate } from './schemas/article';
import { articleQuery, TArticleQuery } from './schemas/articleQuery';

@Controller('articles')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

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
	async like(@Param('id', ParseIntPipe) id: number) {
		return this.articlesService.like(id);
	}

	@Patch(':id/dislike')
	async dislike(@Param('id', ParseIntPipe) id: number) {
		return this.articlesService.dislike(id);
	}

	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new ZodValidationPipe(articleDtoCreate))
	create(@Body() dto: TArticleDtoCreate, @Request() req: RequestWithUser) {
		return this.articlesService.createOne(dto, req.user?.id);
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	delete(@Param('id', ParseIntPipe) id: number) {
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
