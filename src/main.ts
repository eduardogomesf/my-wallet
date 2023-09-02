import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENVS } from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ENVS.APP.PORT, () => {
    console.log(`Server running on port ${ENVS.APP.PORT}`);
  });
}
bootstrap();
