import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentsService } from '../comments.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

const commentsMock = [
	{
		id: 1,
		text: '1',
		userId: 1,
		articleId: 1,
	},
	{
		id: 2,
		text: '2',
		userId: 2,
		articleId: 2,
	},
];

describe('CommentsService', () => {
	let service: CommentsService;
	let prisma: DeepMockProxy<PrismaService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CommentsService, PrismaService],
		})
			.overrideProvider(PrismaService)
			.useValue(mockDeep<PrismaClient>())
			.compile();

		service = module.get(CommentsService);
		prisma = module.get(PrismaService);

		prisma.comment.findMany.mockResolvedValue(commentsMock);
	});

	it('returns all comments', () => {
		expect(service.getAll({})).resolves.toBe(commentsMock);
	});

	it('create comment', () => {
		const payload = { comment: { text: 'new comment' }, userId: 1, articleId: 1 };
		const returned = { userId: payload.userId, articleId: payload.articleId, id: 2, text: payload.comment.text };

		prisma.comment.create.mockResolvedValue(returned);

		expect(service.createOne(payload)).resolves.toBe(returned);
		commentsMock.push(returned);

		expect(service.getAll({})).resolves.toBe(commentsMock);
	});

	it('update comment', () => {
		const payload = { id: 1, text: 'new text' };
		const returned = { userId: 1, articleId: 1, id: payload.id, text: payload.text };

		prisma.comment.update.mockResolvedValue(returned);

		expect(service.updateOne(payload)).resolves.toBe(returned);
	});

	it('delete comment', () => {
		const payload = { id: 1 };
		const returned = { userId: 1, articleId: 1, id: payload.id, text: 'new text' };

		prisma.comment.delete.mockResolvedValue(returned);

		expect(service.deleteOne(payload)).resolves.toBe(returned);
	});
});
