import { profileDto } from './profile.dto';
import { z } from 'zod';
import { Request } from 'express';

export const user = z.object({
	id: z.number(),
	email: z.string(),
	role: z.string(),
	password: z.string(),
	profile: profileDto,
});

export type User = z.infer<typeof user>;

export interface RequestWithUser extends Request {
	user?: User;
}
