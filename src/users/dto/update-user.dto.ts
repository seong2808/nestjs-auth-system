import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDTO extends PickType(UserEntity, ['email' as const]) {
  @IsString()
  @IsNotEmpty()
  password: string;
}
