import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getOne(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	async createUser(data: Prisma.UserCreateInput) {
		const finded = await this.getOne(data.email);

		if (finded) {
			throw new BadRequestException(
				'There is a unique constraint violation, a new user cannot be created with this email',
			);
		}

		return this.prisma.user.create({
			data,
		});
	}

	async updateUser(params: { where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput }): Promise<User> {
		const { where, data } = params;
		return this.prisma.user.update({
			data,
			where,
		});
	}

	async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return this.prisma.user.delete({
			where,
		});
	}
}