import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@/middleware/passport/local.auth.guard';
import { JwtAuthGuard } from '@/middleware/passport/jwt-auth.guard';
import { Public } from '@/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService
  ) { }

  @Post("login")
  @Public()
  @UseGuards(LocalAuthGuard)
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Get('mail')
  @Public()
  sendEmail() {
    this.mailerService
      .sendMail({
        to: 'baonguyxndev@gmail.com',
        subject: 'Xác thực email ✔',
        template: "register",
        context: {
          name: "Bao Nguyxn",
          activationCode: 356034567
        }
      })
    return "ok";
  }
}
