import { z } from 'zod';

export const commentSchema = z.object({
	text: z.string(),
});

export type TCommentDto = z.infer<typeof commentSchema>;
