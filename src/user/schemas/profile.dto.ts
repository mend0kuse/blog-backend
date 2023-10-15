import { z } from 'zod';

export const profileDto = z
	.object({
		name: z.string().nullable(),
		surname: z.string().nullable(),
		username: z.string().nullable(),
		age: z.string().nullable(),
		avatar: z.string().nullable(),
		currency: z.string().nullable(),
		country: z.string().nullable(),
	})
	.partial();

export type ProfileDto = z.infer<typeof profileDto>;
