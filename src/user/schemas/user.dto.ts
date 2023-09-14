import { profileDto } from './profile.dto';
import { z } from 'zod';
import { Request } from 'express';

export const userDto = z.object({
	id: z.number(),
	email: z.string(),
	role: z.string(),
	password: z.string(),
	profile: profileDto,
});

export type UserDto = z.infer<typeof userDto>;

export interface RequestWithUser extends Request {
	user?: UserDto;
}
