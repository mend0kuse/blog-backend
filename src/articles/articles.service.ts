import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TArticleDtoCreate, TArticleDtoUpdate } from './schemas/article';
import { TArticleQuery } from './schemas/articleQuery';

@Injectable()
export class ArticlesService {
	constructor(private prismaService: PrismaService) {}

	private selectUser = {
		id: true,
		role: true,
		email: true,
		profile: true,
	};

	private articlesInclude = {
		types: true,
		codeBlocks: true,
		imageBlocks: true,
		ArticleStats: true,
		User: {
			select: this.selectUser,
		},
		textBlocks: {
			include: {
				paragraphs: true,
			},
		},
	};

	async like(id: number) {
		const founded = await this.getOne(id);

		if (founded) {
			const updated = await this.update({ id, dto: { likes: (founded.ArticleStats?.likes ?? 0) + 1 } });

			return updated;
		}
	}

	async dislike(id: number) {
		const founded = await this.getOne(id);

		if (founded) {
			const updated = await this.update({ id, dto: { dislikes: (founded.ArticleStats?.dislikes ?? 0) + 1 } });

			return updated;
		}
	}

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

	async getOne(id: number) {
		return await this.prismaService.article.findFirst({ where: { id }, include: this.articlesInclude });
	}

	async update(params: { id: number; dto: TArticleDtoUpdate }) {
		const { types, codeBlocks, imageBlocks, likes, dislikes, textBlocks, ...data } = params.dto;
		try {
			return await this.prismaService.article.update({
				where: { id: params.id },
				include: this.articlesInclude,

				data: {
					...data,

					ArticleStats: {
						update: {
							...(likes && {
								likes: likes,
							}),
							...(dislikes && {
								dislikes: dislikes,
							}),
						},
					},

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
		const deleteCode = this.prismaService.articleBlockCode.deleteMany({ where: { articleId: id } });
		const deleteText = this.prismaService.articleBlockText.deleteMany({ where: { articleId: id } });
		const deleteImages = this.prismaService.articleBlockImage.deleteMany({ where: { articleId: id } });
		const deleteTypes = this.prismaService.articleType.deleteMany({ where: { articleId: id } });
		const deleteComments = this.prismaService.comment.deleteMany({
			where: { articleId: id },
		});
		const deleteArticle = this.prismaService.article.delete({ where: { id }, include: this.articlesInclude });

		try {
			return await this.prismaService.$transaction([
				deleteCode,
				deleteText,
				deleteImages,
				deleteTypes,
				deleteComments,
				deleteArticle,
			]);
		} catch (error) {
			throw new Error(error);
		}
	}

	async createOne(article: TArticleDtoCreate, userId: number | undefined) {
		const { codeBlocks, imageBlocks, textBlocks, types, ...mainInfo } = article;

		try {
			return await this.prismaService.article.create({
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
					ArticleStats: {
						create: { dislikes: 0, likes: 0 },
					},
					textBlocks: {
						create: textBlocks?.map((el) => ({
							...el,
							paragraphs: {
								create: el.paragraphs,
							},
						})),
					},
					User: {
						connect: {
							id: userId,
						},
					},
				},
				include: this.articlesInclude,
			});
		} catch (error) {
			throw new Error(error);
		}
	}
}
