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
	types: z.array(z.object({ name: z.nativeEnum(ArticleTypes) })),

	textBlocks: z.array(articleTextBlock).optional(),
	codeBlocks: z.array(articleCodeBlock).optional(),
	imageBlocks: z.array(articleImageBlock).optional(),
});

export type TArticleDto = z.infer<typeof articleDto>;
