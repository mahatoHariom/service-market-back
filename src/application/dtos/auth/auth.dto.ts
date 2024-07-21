import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  // @MinLength(3, { message: 'Username must be at least 3 characters' })
  // @MaxLength(20, { message: 'Username cannot be greaer than 20 characters' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  // @MinLength(5, { message: 'Password must be at least 3 characters' })
  // @MaxLength(8, { message: 'Password cannot be greater than 8 characters' })
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class Tokens {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}

export class refreshDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
