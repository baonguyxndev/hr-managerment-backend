import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(
      createAuthDto.email,
      createAuthDto.password
    )
  }
}
