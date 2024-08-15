import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Box } from './box.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as QRCode from 'qrcode';

interface UserData {
  userId: string;
  boxes: Box[];
}

@Injectable()
export class BoxesService {
  private userData: UserData[] = [];
  private readonly dataFile: string;

  constructor(private configService: ConfigService) {
    this.dataFile = path.join(
      process.cwd(),
      this.configService.get<string>('database.path'),
    );
  }

  async onModuleInit() {
    await this.loadUserData();
  }

  private async loadUserData() {
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      this.userData = JSON.parse(data);
    } catch (error) {
      this.userData = [];
    }
  }

  private async saveUserData() {
    await fs.writeFile(this.dataFile, JSON.stringify(this.userData, null, 2));
  }

  async findAll(userId: string): Promise<Box[]> {
    let userDataIndex = this.userData.findIndex(data => data.userId === userId);

    if (userDataIndex === -1) {
      // New user, create sample boxes
      const sampleBoxes = await this.createSampleBoxes();
      this.userData.push({ userId, boxes: sampleBoxes });
      userDataIndex = this.userData.length - 1;
      await this.saveUserData();
    }

    return this.userData[userDataIndex].boxes;
  }

  private async createSampleBoxes(): Promise<Box[]> {
    const sampleBoxes: Box[] = [
      {
        id: Date.now().toString(),
        name: 'Kitchen Supplies',
        contents: 'Pots, pans, utensils',
        location: 'Kitchen',
        qrCode: '',
      },
      {
        id: (Date.now() + 1).toString(),
        name: 'Books',
        contents: 'Novels, textbooks',
        location: 'Living Room',
        qrCode: '',
      },
      {
        id: (Date.now() + 2).toString(),
        name: 'Tools',
        contents: 'Hammer, screwdrivers, nails',
        location: 'Garage',
        qrCode: '',
      },
    ];

    // Generate QR codes for sample boxes
    for (const box of sampleBoxes) {
      box.qrCode = await this.generateQRCode(box);
    }

    return sampleBoxes;
  }

  async findOne(userId: string, id: string): Promise<Box | undefined> {
    const userDataIndex = this.userData.findIndex(
      (data) => data.userId === userId,
    );
    return userDataIndex !== -1
      ? this.userData[userDataIndex].boxes.find((box) => box.id === id)
      : undefined;
  }

  async create(userId: string, createBoxDto: CreateBoxDto): Promise<Box> {
    const id = Date.now().toString();
    const newBox: Box = {
      ...createBoxDto,
      id,
      qrCode: '', // Initialize with an empty string
    };

    // Generate QR code after creating the full Box object
    newBox.qrCode = await this.generateQRCode(newBox);

    const userDataIndex = this.userData.findIndex(
      (data) => data.userId === userId,
    );
    if (userDataIndex !== -1) {
      this.userData[userDataIndex].boxes.push(newBox);
    } else {
      this.userData.push({ userId, boxes: [newBox] });
    }

    await this.saveUserData();
    return newBox;
  }

  async update(
    userId: string,
    id: string,
    updateBoxDto: UpdateBoxDto,
  ): Promise<Box | undefined> {
    const userDataIndex = this.userData.findIndex(
      (data) => data.userId === userId,
    );
    if (userDataIndex !== -1) {
      const boxIndex = this.userData[userDataIndex].boxes.findIndex(
        (box) => box.id === id,
      );
      if (boxIndex !== -1) {
        const updatedBox = {
          ...this.userData[userDataIndex].boxes[boxIndex],
          ...updateBoxDto,
        };
        updatedBox.qrCode = await this.generateQRCode(updatedBox);
        this.userData[userDataIndex].boxes[boxIndex] = updatedBox;
        await this.saveUserData();
        return updatedBox;
      }
    }
    return undefined;
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const userDataIndex = this.userData.findIndex(
      (data) => data.userId === userId,
    );
    if (userDataIndex !== -1) {
      const initialLength = this.userData[userDataIndex].boxes.length;
      this.userData[userDataIndex].boxes = this.userData[
        userDataIndex
      ].boxes.filter((box) => box.id !== id);
      if (this.userData[userDataIndex].boxes.length !== initialLength) {
        await this.saveUserData();
        return true;
      }
    }
    return false;
  }

  private async generateQRCode(box: Box): Promise<string> {
    try {
      const qrData = {
        id: box.id,
        name: box.name,
        contents: box.contents,
        location: box.location,
      };
      return await QRCode.toDataURL(JSON.stringify(qrData));
    } catch (err) {
      console.error('Error generating QR code:', err);
      return '';
    }
  }
}
