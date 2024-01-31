import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

class Application {
  private logger = new Logger(Application.name);
  private PORT: string;

  constructor(private server: NestExpressApplication) {
    this.server = server;
    this.PORT = process.env.PORT || '3000';
  }

  private async setUpGlobalMiddleware() {
    // 추가예정
    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    this.server.use(cookieParser());
    this.server.use(passport.initialize());
    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
    );
    this.server.useGlobalFilters(new HttpExceptionFilter());
  }

  async bootstrap() {
    await this.setUpGlobalMiddleware();
    await this.server.listen(this.PORT);
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Application(server);
  await app.bootstrap();
}

init().catch((error) => {
  new Logger('init').error(error);
});
