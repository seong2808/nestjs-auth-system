import {
  Controller,
  Post,
  Body,
  Res,
  Patch,
  UseGuards,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { RegisterUserDTO } from '../dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDTO } from '../dto/login-user.dto';
import { Response } from 'express';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { OnlyPrivateInterceptor } from 'src/common/interceptors/only-private.interceptor';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDTO } from '../dto/user.dto';
import { OnlyAdminInterceptor } from 'src/common/interceptors/only-admin.interceptor';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  // 회원가입
  @Post()
  async signUp(@Body() registerUserDTO: RegisterUserDTO) {
    return await this.usersService.registerUser(registerUserDTO);
  }

  // 로그인
  @Post('login')
  async logIn(
    @Body() loginUserDTO: LoginUserDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, user } =
      await this.usersService.loginAndGenerateJwt(loginUserDTO);

    response.cookie('jwt', accessToken, { httpOnly: true });
    return user;
  }

  // 로그아웃
  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }

  // 비밀번호 변경
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlyPrivateInterceptor)
  async Update(
    @Body() updateUserDTO: UpdateUserDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return await this.usersService.updateUser(updateUserDTO, currentUser);
  }

  // 회원 목록 조회 (ADMIN )
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlyAdminInterceptor)
  async getUserList() {
    const data = await this.usersService.findAllUser();
    return data;
  }

  // 회원 권한 변경
  @Patch('role')
  @UseGuards(JwtAuthGuard)
  async role(@CurrentUser() CurrentUser: UserDTO) {
    return await this.usersService.changeRole(CurrentUser);
  }
}
