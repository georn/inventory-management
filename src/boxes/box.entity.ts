import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Box {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column()
  contents: string;

  @Column()
  location: string;

  @Column({ type: 'text' })
  qrCode: string;
}
