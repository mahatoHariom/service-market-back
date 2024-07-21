import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';
export class UserDto implements User {
  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ enum: Role })
  role: Role
}
