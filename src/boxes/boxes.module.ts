import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoxesViewController } from './boxes-view.controller';
import { BoxesApiController } from './boxes-api.controller';
import { BoxesService } from './boxes.service';
import { Box } from './box.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Box])],
  controllers: [BoxesViewController, BoxesApiController],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}
