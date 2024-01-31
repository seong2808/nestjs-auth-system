import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity';

export class UserDTO extends OmitType(UserEntity, ['password' as const]) {}
