import { z } from 'zod';

export const notificationSchema = z.object({
	type: z.enum(['like', 'dislike', 'comment']),
	userId: z.number().optional(),
	articleId: z.number(),
});

export type TCreateNotification = z.infer<typeof notificationSchema>;
