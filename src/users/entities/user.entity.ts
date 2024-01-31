import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'User' })
export class UserEntity extends CommonEntity {
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 작성헤주세요.' })
  @Column({ type: 'varchar', nullable: false })
  username: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;
}
