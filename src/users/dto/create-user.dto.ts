import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
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
export class CreateUserDto {
  @IsNotEmpty({
    message: 'Khong bo trong ten',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'Email khong duoc de trong',
  })
  email: string;

  @IsNotEmpty({
    message: 'password khong duoc de trong',
  })
  password: string;

  @IsNotEmpty({
    message: 'Khong bo trong tuoi',
  })
  age: string;

  @IsNotEmpty({
    message: 'Khong bo trong dia chi',
  })
  address: string;

  @IsNotEmpty({
    message: 'Khong bo trong gioi tinh',
  })
  gender: string;

  @IsNotEmpty({
    message: 'Khong de trong role',
  })
  role: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({
    message: 'Khong bo trong ten',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty({
    message: 'Email khong duoc de trong',
  })
  email: string;

  @IsNotEmpty({
    message: 'password khong duoc de trong',
  })
  password: string;

  @IsNotEmpty({
    message: 'Khong bo trong tuoi',
  })
  age: string;
  @IsNotEmpty({
    message: 'Khong bo trong dia chi',
  })
  address: string;

  @IsNotEmpty({
    message: 'Khong bo trong gioi tinh',
  })
  gender: string;
}
