import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Box } from './box.entity';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class BoxesService {
  constructor(
    @InjectRepository(Box)
    private boxesRepository: Repository<Box>,
  ) {}

  async findAll(userId: string): Promise<Box[]> {
    const boxes = await this.boxesRepository.find({ where: { userId } });
    
    if (boxes.length === 0) {
      // New user, create sample boxes
      return await this.createSampleBoxes(userId);
    }

    return boxes;
  }

  private async createSampleBoxes(userId: string): Promise<Box[]> {
    const sampleData = [
      {
        name: 'Kitchen Supplies',
        contents: 'Pots, pans, utensils',
        location: 'Kitchen',
      },
      {
        name: 'Books',
        contents: 'Novels, textbooks',
        location: 'Living Room',
      },
      {
        name: 'Tools',
        contents: 'Hammer, screwdrivers, nails',
        location: 'Garage',
      },
    ];

    const sampleBoxes: Box[] = [];
    for (const data of sampleData) {
      const box = this.boxesRepository.create({
        ...data,
        userId,
        qrCode: '',
      });
      // We need to save first to get the ID if we want to include it in the QR code, 
      // but TypeORM with UUID generates it on creation if we use create() then save().
      // Actually with PrimaryGeneratedColumn('uuid'), it's generated on save.
      const savedBox = await this.boxesRepository.save(box);
      savedBox.qrCode = await this.generateQRCode(savedBox);
      await this.boxesRepository.save(savedBox);
      sampleBoxes.push(savedBox);
    }

    return sampleBoxes;
  }

  async findOne(userId: string, id: string): Promise<Box | undefined> {
    return await this.boxesRepository.findOne({ where: { id, userId } });
  }

  async create(userId: string, createBoxDto: CreateBoxDto): Promise<Box> {
    const newBox = this.boxesRepository.create({
      ...createBoxDto,
      userId,
      qrCode: '',
    });

    // Save first to get the generated UUID
    const savedBox = await this.boxesRepository.save(newBox);
    
    // Generate QR code and update
    savedBox.qrCode = await this.generateQRCode(savedBox);
    return await this.boxesRepository.save(savedBox);
  }

  async update(
    userId: string,
    id: string,
    updateBoxDto: UpdateBoxDto,
  ): Promise<Box | undefined> {
    const box = await this.findOne(userId, id);
    if (!box) {
      return undefined;
    }

    Object.assign(box, updateBoxDto);
    box.qrCode = await this.generateQRCode(box);
    
    return await this.boxesRepository.save(box);
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const result = await this.boxesRepository.delete({ id, userId });
    return result.affected > 0;
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
