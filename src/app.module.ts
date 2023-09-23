import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [ArticlesModule, UserModule, AuthModule, CommentsModule],
})
export class AppModule {}
