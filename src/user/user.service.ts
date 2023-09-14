import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './schemas/profile.dto';

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

		const { password: _, ...created } = await this.prisma.user.create({
			data: {
				...data,
				profile: { create: {} },
			},
		});

		return created;
	}

	async updateProfile(params: { email?: string; profile: ProfileDto }) {
		const { email, profile } = params;

		const { password: _, ...updated } = await this.prisma.user.update({
			where: { email },
			data: {
				profile: {
					update: profile,
				},
			},
			include: {
				profile: true,
			},
		});

		return updated;
	}
}
