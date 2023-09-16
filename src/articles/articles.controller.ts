import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { Body, Delete, Param, Patch, Post, Query, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/auth/roles/roles';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { ArticlesService } from './articles.service';
import { articleDto, articleDtoUpdate, TArticleDtoCreate, TArticleDtoUpdate } from './schemas/article';
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

		return founded;
	}

	@Post()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Admin)
	@UsePipes(new ZodValidationPipe(articleDto))
	create(@Body() dto: TArticleDtoCreate) {
		return this.articlesService.createOne(dto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Admin)
	delete(@Param('id', ParseIntPipe) id: number) {
		return this.articlesService.deleteOne(id);
	}

	@Patch(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Admin)
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ZodValidationPipe(articleDtoUpdate)) dto: TArticleDtoUpdate,
	) {
		return this.articlesService.update({ id, dto });
	}
}
