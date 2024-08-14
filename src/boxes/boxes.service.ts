import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Box } from './box.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as QRCode from 'qrcode';

@Injectable()
export class BoxesService {
  private boxes: Box[] = [];
  private readonly dataFile: string;

  constructor(private configService: ConfigService) {
    this.dataFile = path.join(
      process.cwd(),
      this.configService.get<string>('database.path'),
    );
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
    return this.boxes.find((box) => box.id === id);
  }

  async create(createBoxDto: CreateBoxDto): Promise<Box> {
    const id = Date.now().toString();
    const newBox: Box = {
      ...createBoxDto,
      id,
      qrCode: '', // We'll generate this next
    };

    newBox.qrCode = await this.generateQRCode(newBox);

    this.boxes.push(newBox);
    await this.saveBoxes();
    return newBox;
  }

  async update(
    id: string,
    updateBoxDto: UpdateBoxDto,
  ): Promise<Box | undefined> {
    const index = this.boxes.findIndex((b) => b.id === id);
    if (index !== -1) {
      const updatedBox = { ...this.boxes[index], ...updateBoxDto };
      updatedBox.qrCode = await this.generateQRCode(updatedBox);

      this.boxes[index] = updatedBox;
      await this.saveBoxes();
      return updatedBox;
    }
    return undefined;
  }

  async remove(id: string): Promise<boolean> {
    const initialLength = this.boxes.length;
    this.boxes = this.boxes.filter((box) => box.id !== id);
    if (this.boxes.length !== initialLength) {
      await this.saveBoxes();
      return true;
    }
    return false;
  }

  private async generateQRCode(box: Box): Promise<string> {
    try {
      // Create a new object with only the necessary data
      const qrData = {
        id: box.id,
        name: box.name,
        contents: box.contents,
        location: box.location,
      };

      // Convert the object to a JSON string
      const jsonString = JSON.stringify(qrData);

      // Generate QR code
      return await QRCode.toDataURL(jsonString);
    } catch (err) {
      console.error('Error generating QR code:', err);
      return '';
    }
  }
}
