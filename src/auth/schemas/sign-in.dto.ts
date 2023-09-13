import { z } from 'zod';

export const signInDto = z
	.object({
		email: z.string().email(),
		password: z.string().min(7, { message: 'Password must contain at least 7 character(s)' }),
	})
	.required();

export type SignInDto = z.infer<typeof signInDto>;
