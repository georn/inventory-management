import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@Controller('api/v1/boxes')
export class BoxesApiController {
  constructor(private readonly boxesService: BoxesService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const userId = req['userId'];
    return this.boxesService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = req['userId'];
    const box = await this.boxesService.findOne(userId, id);
    if (!box) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return box;
  }

  @Post()
  async create(@Req() req: Request, @Body() createBoxDto: CreateBoxDto) {
    const userId = req['userId'];
    return this.boxesService.create(userId, createBoxDto);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateBoxDto: UpdateBoxDto,
  ) {
    const userId = req['userId'];
    const updatedBox = await this.boxesService.update(userId, id, updateBoxDto);
    if (!updatedBox) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return updatedBox;
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req['userId'];
    const deleted = await this.boxesService.remove(userId, id);
    if (!deleted) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return { success: true };
  }
}
