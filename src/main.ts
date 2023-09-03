import { NestFactory } from '@nestjs/core';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { AppModule } from './app.module';
import { ENVS } from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerDocument = YAML.load('./docs/swagger.yaml');
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  await app.listen(ENVS.APP.PORT, () => {
    console.log(`Server running on port ${ENVS.APP.PORT}`);
  });
}
bootstrap();
