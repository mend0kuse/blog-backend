import { z } from 'zod';

export const profileDto = z
	.object({
		name: z.string(),
		surname: z.string(),
		username: z.string(),
		age: z.string(),
		avatar: z.string(),
		currency: z.string(),
		country: z.string(),
	})
	.partial();

export type ProfileDto = z.infer<typeof profileDto>;
