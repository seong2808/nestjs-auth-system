import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDTO extends PickType(UserEntity, [
  'email',
  'username',
] as const) {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 작성해주세요.' })
  password: string;
}
