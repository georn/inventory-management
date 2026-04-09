import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoxesModule } from './boxes/boxes.module';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserIdentificationMiddleware } from './common/middleware/user-identification.middleware';
import configuration from './config/configuration';
import { Box } from './boxes/box.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('database.path').replace('.json', '.db'),
        entities: [Box],
        synchronize: true, // Use carefully in production, but okay for this prototype
      }),
      inject: [ConfigService],
    }),
    BoxesModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdentificationMiddleware).forRoutes('*');
  }
}
