import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TArticleDtoCreate, TArticleDtoUpdate } from './schemas/article';
import { TArticleQuery } from './schemas/articleQuery';

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

	getAll(query: TArticleQuery) {
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

		return this.prismaService.article.findMany({ ...args, include: this.articlesInclude });
	}

	getOne(id: number) {
		return this.prismaService.article.findFirst({ where: { id }, include: this.articlesInclude });
	}

	async update(params: { id: number; dto: TArticleDtoUpdate }) {
		const { types, codeBlocks, imageBlocks, textBlocks, ...data } = params.dto;
		try {
			return await this.prismaService.article.update({
				where: { id: params.id },
				include: this.articlesInclude,

				data: {
					...data,

					types: {
						...(types && {
							deleteMany: { id: { in: types.map(({ id }) => id) } },
							createMany: { data: types },
						}),
					},

					codeBlocks: {
						...(codeBlocks && {
							deleteMany: { id: { in: codeBlocks.map(({ id }) => id) } },
							createMany: { data: codeBlocks },
						}),
					},

					imageBlocks: {
						...(imageBlocks && {
							deleteMany: { id: { in: imageBlocks.map(({ id }) => id) } },
							createMany: { data: imageBlocks },
						}),
					},

					textBlocks: {
						...(textBlocks && {
							deleteMany: { id: { in: textBlocks.map(({ id }) => id) } },
							createMany: { data: textBlocks },
						}),
					},
				},
			});
		} catch (error) {
			throw new NotFoundException();
		}
	}

	async deleteOne(id: number) {
		try {
			return await this.prismaService.article.delete({ where: { id }, include: this.articlesInclude });
		} catch (error) {
			throw new NotFoundException();
		}
	}

	createOne(article: TArticleDtoCreate) {
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
