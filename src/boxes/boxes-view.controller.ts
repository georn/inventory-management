import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Render,
  Redirect,
  NotFoundException,
} from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@Controller('boxes')
export class BoxesViewController {
  constructor(private readonly boxesService: BoxesService) {}

  @Get()
  @Render('boxes/index')
  async findAll() {
    const boxes = await this.boxesService.findAll();
    return { boxes };
  }

  @Get('new')
  @Render('boxes/new')
  newBox() {
    return {};
  }

  @Post()
  @Redirect('/boxes')
  async create(@Body() createBoxDto: CreateBoxDto) {
    await this.boxesService.create(createBoxDto);
  }

  @Get(':id')
  @Render('boxes/show')
  async findOne(@Param('id') id: string) {
    const box = await this.boxesService.findOne(id);
    if (!box) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return { box };
  }

  @Get(':id/edit')
  @Render('boxes/edit')
  async edit(@Param('id') id: string) {
    const box = await this.boxesService.findOne(id);
    if (!box) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return { box };
  }

  @Put(':id')
  @Redirect('/boxes')
  async update(@Param('id') id: string, @Body() updateBoxDto: UpdateBoxDto) {
    const updatedBox = await this.boxesService.update(id, updateBoxDto);
    if (!updatedBox) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
  }

  @Delete(':id')
  @Redirect('/boxes')
  async remove(@Param('id') id: string) {
    const deleted = await this.boxesService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
  }
}
