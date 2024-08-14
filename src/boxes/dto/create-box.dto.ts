import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoxDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  contents: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}
