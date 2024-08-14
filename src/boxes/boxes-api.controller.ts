import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@Controller('api/v1/boxes')
export class BoxesApiController {
  constructor(private readonly boxesService: BoxesService) {}

  @Get()
  async findAll() {
    return this.boxesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const box = await this.boxesService.findOne(id);
    if (!box) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return box;
  }

  @Post()
  async create(@Body() createBoxDto: CreateBoxDto) {
    return this.boxesService.create(createBoxDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBoxDto: UpdateBoxDto) {
    const updatedBox = await this.boxesService.update(id, updateBoxDto);
    if (!updatedBox) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return updatedBox;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.boxesService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return { success: true };
  }
}
