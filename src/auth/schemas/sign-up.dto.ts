import { z } from 'zod';

export const signUpDto = z.object({
	email: z.string().email(),
	password: z.string().min(7, { message: 'Password must contain at least 7 character(s)' }),
});

export type SignUpDto = z.infer<typeof signUpDto>;
