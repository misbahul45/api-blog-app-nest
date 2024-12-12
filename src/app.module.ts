import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { LoggingMiddleware } from './common/logging.middleware';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [CommonModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(LoggingMiddleware).forRoutes("*")
  }
}
