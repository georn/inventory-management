import { Module } from '@nestjs/common';
import { BoxesViewController } from './boxes-view.controller';
import { BoxesApiController } from './boxes-api.controller';
import { BoxesService } from './boxes.service';

@Module({
  controllers: [BoxesViewController, BoxesApiController],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}
