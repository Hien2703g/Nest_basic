import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

//Data transfer object //class=()
class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateJobDto {
  @IsNotEmpty({
    message: 'Khong bo trong ten',
  })
  name: string;

  @IsNotEmpty({
    message: 'kĩ năng khong duoc de trong',
  })
  @IsArray({
    message: 'skill phai co dang array',
  })
  @IsString({
    each: true,
    message: 'skill ddijnh dang string',
  })
  skills: string[];

  @IsNotEmpty({
    message: 'Khong bo trong địa chỉ',
  })
  location: string;

  @IsNotEmpty({
    message: 'Khong bo trong mức lương',
  })
  salary: number;

  @IsNotEmpty({
    message: 'Khong bo trong hạng',
  })
  level: string;

  @IsNotEmpty({
    message: 'Khong de trong mo ta',
  })
  description: string;

  @IsNotEmpty({
    message: 'Khong bo trong ngay bat dau',
  })
  startDate: Date;

  @IsNotEmpty({
    message: 'Khong bo trong ngay ket thuc',
  })
  endDate: Date;

  isActive: boolean;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
