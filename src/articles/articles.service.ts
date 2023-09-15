import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TArticleDto } from './schemas/article';

@Injectable()
export class ArticlesService {
	constructor(private prismaService: PrismaService) {}

	getAll(): string {
		return 'All articles';
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
			include: {
				codeBlocks: true,
				imageBlocks: true,
				textBlocks: {
					include: {
						paragraphs: true,
					},
				},
				types: true,
			},
		});
	}
}
