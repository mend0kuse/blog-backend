export function excludeFields<M, T extends Array<keyof M>>(user: M, keys: T): Omit<M, T[number]> {
	const tmp = user;

	for (const key in tmp) {
		if (keys.includes(key as keyof M)) delete tmp[key];
	}

	return tmp;
}
