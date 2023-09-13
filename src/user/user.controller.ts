import { Controller, Delete, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Delete(':id')
	async delete(@Param() params: { id: number }) {
		return this.userService.deleteUser({ id: params.id });
	}

	@Put(':id')
	async update(@Param() params: { id: number }) {
		return this.userService.deleteUser({ id: params.id });
	}
}
