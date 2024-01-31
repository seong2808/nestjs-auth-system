import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDTO } from '../dto/register-user.dto';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from '../dto/login-user.dto';
import { UserDTO } from '../dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDTO } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDTO: RegisterUserDTO): Promise<void> {
    const { email, password } = registerUserDTO;
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersRepository.save({
      ...registerUserDTO,
      password: hashedPassword,
    });
  }

  async loginAndGenerateJwt(
    loginUserDTO: LoginUserDTO,
  ): Promise<{ accessToken: string; user: UserDTO }> {
    const { email, password } = loginUserDTO;
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('해당하는 이메일은 존재하지 않습니다.');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('로그인에 실패하셨습니다.');
    }
    try {
      const accessToken = await this.jwtService.signAsync(
        { sub: user.id },
        { secret: process.env.SECRET_KEY },
      );
      return { accessToken, user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateUser(
    updateUserDTO: UpdateUserDTO,
    currentUser: UserDTO,
  ): Promise<any> {
    const { password } = updateUserDTO;
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersRepository.update(
      { id: currentUser.id },
      { password: hashedPassword },
    );
  }

  async findUserById(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new Error();
      }
      return user;
    } catch (error) {
      throw new BadRequestException('해당하는 사용자를 찾을 수 없습니다.');
    }
  }

  async findAllUser() {
    return await this.usersRepository.find();
  }
}
