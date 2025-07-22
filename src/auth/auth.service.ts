import { BadRequestException, Injectable } from '@nestjs/common';
import { use } from 'passport';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Request, response, Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  //Username/pass là 2 thư viện passport trả về
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOnebyUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }
  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);
    //update refresh_token
    await this.usersService.updateUserToken(refresh_token, _id);
    // set cookies
    const jwtRefreshExpire = this.configService.get('JWT_REFRESH_EXPIRE');
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(
        jwtRefreshExpire as `${number}${
          | 'ms'
          | 's'
          | 'm'
          | 'h'
          | 'd'
          | 'w'
          | 'y'}`,
      ),
    });
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }
  async register(user: RegisterUserDto) {
    let newUser = await this.usersService.register(user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }
  createRefreshToken = (payload) => {
    const refesh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });
    return refesh_token;
  };

  processNewToken = async (refesh_token: string, response: Response) => {
    try {
      this.jwtService.verify(refesh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      let user = await this.usersService.findUserbyToken(refesh_token);
      // console.log(user);
      if (user) {
        // update refresher_token
        const { _id, name, email, role } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };
        const refresh_token = this.createRefreshToken(payload);
        //update refresh_token
        await this.usersService.updateUserToken(refresh_token, _id.toString());
        // set cookies
        response.clearCookie('refresh_token');
        const jwtRefreshExpire = this.configService.get('JWT_REFRESH_EXPIRE');
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(
            jwtRefreshExpire as `${number}${
              | 'ms'
              | 's'
              | 'm'
              | 'h'
              | 'd'
              | 'w'
              | 'y'}`,
          ),
        });
        return {
          access_token: this.jwtService.sign(payload),
          refresh_token,
          user: {
            _id,
            name,
            email,
            role,
          },
        };
      } else {
        throw new BadRequestException('Refresh_token khong hop le');
      }
      //todo
    } catch (error) {
      console.log('>>check error', error);
      throw new BadRequestException('Refresh_token khong hop le');
    }
  };
  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'Đã logout thành công';
  };
}
