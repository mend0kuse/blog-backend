import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticlesService {
	getAll(): string {
		return 'All articles';
	}
}
