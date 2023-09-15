import { Controller, Get } from '@nestjs/common';
import { Body, Post, UsePipes } from '@nestjs/common/decorators';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { ArticlesService } from './articles.service';
import { articleDto, TArticleDto } from './schemas/article';

@Controller('articles')
export class ArticlesController {
	constructor(private readonly articlesService: ArticlesService) {}

	@Get()
	getAll(): string {
		return this.articlesService.getAll();
	}

	@Post()
	@UsePipes(new ZodValidationPipe(articleDto))
	create(@Body() dto: TArticleDto) {
		return this.articlesService.createOne(dto);
	}
}
