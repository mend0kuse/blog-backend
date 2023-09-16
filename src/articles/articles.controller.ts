import { Controller, Get } from '@nestjs/common';
import { Body, Post, Query, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { ArticlesService } from './articles.service';
import { articleDto, TArticleDto } from './schemas/article';
import { TArticleQuery, articleQuery } from './schemas/articleQuery';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role, Roles } from 'src/auth/roles/roles';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('articles')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	@UsePipes(new ZodValidationPipe(articleQuery))
	getAll(@Query() query: TArticleQuery) {
		const args: Prisma.ArticleFindManyArgs = {
			...(query.sort && { orderBy: { [query.sort]: query.order ?? 'asc' } }),
			...(query.category && {
				where: {
					types: { some: { name: query.category } },
				},
			}),
			...(query.limit && { take: query.limit }),
			...(query.limit && query.page && { take: query.limit, skip: (query.page - 1) * query.limit }),
		};

		return this.articlesService.getAll(args);
	}

	@Post()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(Role.Admin)
	@UsePipes(new ZodValidationPipe(articleDto))
	create(@Body() dto: TArticleDto) {
		return this.articlesService.createOne(dto);
	}
}
