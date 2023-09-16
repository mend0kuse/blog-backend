import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TArticleDto } from './schemas/article';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
	constructor(private prismaService: PrismaService) {}

	private articlesInclude = {
		types: true,
		codeBlocks: true,
		imageBlocks: true,
		textBlocks: {
			include: {
				paragraphs: true,
			},
		},
	};

	getAll(args?: Prisma.ArticleFindManyArgs) {
		return this.prismaService.article.findMany({ ...args, include: this.articlesInclude });
	}

	createOne(article: TArticleDto) {
		const { codeBlocks, imageBlocks, textBlocks, types, ...mainInfo } = article;
		return this.prismaService.article.create({
			data: {
				...mainInfo,
				views: 0,
				types: {
					create: types,
				},
				codeBlocks: {
					create: codeBlocks,
				},
				imageBlocks: {
					create: imageBlocks,
				},
				textBlocks: {
					create: textBlocks?.map((el) => ({
						...el,
						paragraphs: {
							create: el.paragraphs,
						},
					})),
				},
			},
			include: this.articlesInclude,
		});
	}
}
