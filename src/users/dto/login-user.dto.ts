import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDTO extends PickType(UserEntity, ['email'] as const) {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 작성해주세요.' })
  password: string;
}
