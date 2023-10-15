import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';
import { DelayMiddleware } from './delay.service';

@Module({
	imports: [ArticlesModule, UserModule, AuthModule, CommentsModule],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		if (process.env.NODE_ENV === 'development') {
			consumer.apply(DelayMiddleware).forRoutes('*');
		}
	}
}
