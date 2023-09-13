import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signIn(@Body() signInDto: { email: string; password: string }) {
		return this.authService.signIn(signInDto.email, signInDto.password);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signup')
	signup(@Body() signUnDto: Omit<User, 'id'>) {
		return this.authService.signUp(signUnDto);
	}
}
