import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as UserModel } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UserService,
		private jwtService: JwtService,
	) {}

	async signIn(email: string, pass: string) {
		const user = await this.usersService.getOne(email);

		if (!user || user.password !== pass) {
			throw new UnauthorizedException();
		}

		const payload = { sub: user.id, username: user.name };

		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}

	async signUp(user: Omit<UserModel, 'id'>) {
		return this.usersService.createUser(user);
	}
}
