import { z } from 'zod';

export enum ArticleTypes {
	IT = 'IT',
	Science = 'Science',
	Ecology = 'Ecology',
}

export const articleCodeBlock = z.object({
	code: z.string(),
	order: z.number(),
});

export const articleTextBlock = z.object({
	paragraphs: z.array(z.object({ text: z.string() })),
	order: z.number(),
	title: z.string(),
});

export const articleImageBlock = z.object({
	src: z.string(),
	title: z.string(),
	order: z.number(),
});

export const articleDto = z.object({
	title: z.string(),
	suptitle: z.string(),
	preview: z.string(),
});

export const articleTypesDto = z.object({
	name: z.nativeEnum(ArticleTypes),
});

export const articleDtoCreate = articleDto
	.extend({
		types: z.array(articleTypesDto),

		textBlocks: z.array(articleTextBlock).optional(),
		codeBlocks: z.array(articleCodeBlock).optional(),
		imageBlocks: z.array(articleImageBlock).optional(),
	})
	.strict();

export const articleDtoUpdate = articleDto
	.partial()
	.extend({
		types: z.array(articleTypesDto.extend({ id: z.number() })).optional(),
		views: z.number().optional(),
		likes: z.number().optional(),
		dislikes: z.number().optional(),

		textBlocks: z.array(articleTextBlock.extend({ id: z.number() })).optional(),
		codeBlocks: z.array(articleCodeBlock.extend({ id: z.number() })).optional(),
		imageBlocks: z.array(articleImageBlock.extend({ id: z.number() })).optional(),
	})
	.strict();

export type TArticleDto = z.infer<typeof articleDto>;
export type TArticleDtoCreate = z.infer<typeof articleDtoCreate>;
export type TArticleDtoUpdate = z.infer<typeof articleDtoUpdate>;
