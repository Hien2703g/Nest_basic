import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Khoong de trong' })
  name: string;
  @IsNotEmpty({ message: 'Khoong de trong' })
  address: string;
  @IsNotEmpty({ message: 'Khoong de trong' })
  description: string;
}
