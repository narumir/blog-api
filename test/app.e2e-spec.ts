import * as request from 'supertest';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  createPublicKey,
} from 'crypto';
import {
  AppModule,
} from './../src/app.module';
describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404)
  });

  it('/encrypt/public-key (GET)', async () => {
    const result = await app
      .inject({ method: 'GET', url: '/encrypt/public-key' });
    expect(result.statusCode).toEqual(200);
    const { publicKey } = JSON.parse(result.payload);
    const key = createPublicKey(publicKey)
    expect(key).not.toBeNull();
  });

  afterAll(async () => {
    await app.close();
  });
});
