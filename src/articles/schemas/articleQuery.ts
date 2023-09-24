import { z } from 'zod';
import { ArticleTypes, articleDto } from './article';
import { stringToNumber } from 'src/validation/stringToNumber';

export const articleQuery = z
	.object({
		sort: articleDto.extend({ createdAt: z.date() }).keyof(),
		order: z.union([z.literal('asc'), z.literal('desc')]),
		category: z.nativeEnum(ArticleTypes),
		limit: stringToNumber,
		page: stringToNumber,
		q: z.string(),
	})
	.partial();

export type TArticleQuery = z.infer<typeof articleQuery>;
