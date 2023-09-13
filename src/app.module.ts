import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [ArticlesModule, UserModule, AuthModule],
})
export class AppModule {}
