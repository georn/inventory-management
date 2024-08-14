import { Module } from '@nestjs/common';
import { BoxesController } from './boxes.controller';
import { BoxesService } from './boxes.service';

@Module({
  controllers: [BoxesController],
  providers: [BoxesService],
  exports: [BoxesService],
})
export class BoxesModule {}
