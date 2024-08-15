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
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@Controller()
export class BoxesViewController {
  constructor(private readonly boxesService: BoxesService) {}

  @Get('/')
  @Get('boxes')
  @Render('boxes/index')
  async findAll(@Req() req: Request) {
    const userId = req['userId'];
    const boxes = await this.boxesService.findAll(userId);
    return { boxes };
  }

  @Get('boxes/new')
  @Render('boxes/new')
  newBox() {
    return {};
  }

  @Post('boxes')
  @Redirect('/')
  async create(@Req() req: Request, @Body() createBoxDto: CreateBoxDto) {
    const userId = req['userId'];
    await this.boxesService.create(userId, createBoxDto);
  }

  @Get('boxes/:id')
  @Render('boxes/show')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = req['userId'];
    const box = await this.boxesService.findOne(userId, id);
    if (!box) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return { box };
  }

  @Get('boxes/:id/edit')
  @Render('boxes/edit')
  async edit(@Req() req: Request, @Param('id') id: string) {
    const userId = req['userId'];
    const box = await this.boxesService.findOne(userId, id);
    if (!box) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return { box };
  }

  @Put('boxes/:id')
  @Redirect('/')
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
  }

  @Delete('boxes/:id')
  @Redirect('/')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req['userId'];
    const deleted = await this.boxesService.remove(userId, id);
    if (!deleted) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
  }
}
