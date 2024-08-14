import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Box } from './box.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class BoxesService {
  private boxes: Box[] = [];
  private readonly dataFile: string;

  constructor(private configService: ConfigService) {
    this.dataFile = path.join(process.cwd(), this.configService.get<string>('database.path'));
  }

  async onModuleInit() {
    await this.loadBoxes();
  }

  private async loadBoxes() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      this.boxes = JSON.parse(data);
    } catch (error) {
      this.boxes = [];
    }
  }

  private async saveBoxes() {
    await fs.writeFile(this.dataFile, JSON.stringify(this.boxes, null, 2));
  }

  async findAll(): Promise<Box[]> {
    return this.boxes;
  }

  async findOne(id: string): Promise<Box | undefined> {
    return this.boxes.find(box => box.id === id);
  }

  async create(createBoxDto: CreateBoxDto): Promise<Box> {
    const newBox: Box = {
      ...createBoxDto,
      id: Date.now().toString(),
      qrCode: `${this.configService.get<string>('qrCode.baseUrl')}${Date.now().toString()}`
    };
    this.boxes.push(newBox);
    await this.saveBoxes();
    return newBox;
  }

  async update(id: string, updateBoxDto: UpdateBoxDto): Promise<Box | undefined> {
    const index = this.boxes.findIndex(b => b.id === id);
    if (index !== -1) {
      this.boxes[index] = { ...this.boxes[index], ...updateBoxDto };
      await this.saveBoxes();
      return this.boxes[index];
    }
    return undefined;
  }

  async remove(id: string): Promise<boolean> {
    const initialLength = this.boxes.length;
    this.boxes = this.boxes.filter(box => box.id !== id);
    if (this.boxes.length !== initialLength) {
      await this.saveBoxes();
      return true;
    }
    return false;
  }
}
