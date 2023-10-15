import { NotFoundException } from '@nestjs/common/exceptions';
import { Body, Controller, Patch, Req, UseGuards, UsePipes, Get, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { excludeFields } from 'src/shared/lib/excludeFields';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { profileDto, ProfileDto } from './schemas/profile.dto';
import { RequestWithUser } from './schemas/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Patch('profile')
	@UseGuards(AuthGuard)
	@UsePipes(new ZodValidationPipe(profileDto))
	updateProfile(@Req() request: RequestWithUser, @Body() dto: ProfileDto) {
		return this.userService.updateProfile({ email: request.user?.email, profile: dto });
	}

	@Get('/notif')
	@UseGuards(AuthGuard)
	async getNotif(@Req() request: RequestWithUser) {
		return this.userService.getNotifications(request.user?.id);
	}

	@Get(':id')
	async getOne(@Param('id', ParseIntPipe) id: number) {
		const finded = await this.userService.getOne({ id });

		if (!finded) {
			throw new NotFoundException();
		}

		return excludeFields(finded, ['password']);
	}

	@Delete('/notif')
	@UseGuards(AuthGuard)
	async readNotifications(@Req() request: RequestWithUser, @Body('ids') ids: number[]) {
		return this.userService.readNotifications({ userId: request.user?.id, ids });
	}
}
