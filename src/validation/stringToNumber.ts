import { z } from 'zod';

export const stringToNumber = z.string().transform((val, ctx) => {
	const parsed = Number(val);

	if (isNaN(parsed)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Not a number',
		});

		return z.NEVER;
	}

	return parsed;
});
