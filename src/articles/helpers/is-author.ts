import { ForbiddenException } from '@nestjs/common/exceptions';
import { UserDto } from 'src/user/schemas/user.dto';
import { TArticleDtoUpdate } from '../schemas/article';

export const isAuthor = (user: UserDto | undefined, article: TArticleDtoUpdate & { userId: number }) => {
	if (user?.id !== article.userId && user?.role !== 'admin') {
		throw new ForbiddenException();
	}

	return true;
};
