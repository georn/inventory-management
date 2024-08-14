import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { Box } from './box.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@Controller('boxes')
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @Get()
  async findAll(): Promise<Box[]> {
    return this.boxesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Box> {
    const box = await this.boxesService.findOne(id);
    if (!box) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return box;
  }

  @Post()
  async create(@Body() createBoxDto: CreateBoxDto): Promise<Box> {
    return this.boxesService.create(createBoxDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBoxDto: UpdateBoxDto): Promise<Box> {
    const updatedBox = await this.boxesService.update(id, updateBoxDto);
    if (!updatedBox) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return updatedBox;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const deleted = await this.boxesService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
  }
}
