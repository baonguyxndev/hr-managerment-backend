import { comparePasswordHelper } from '@/helpers/util';
import { EmployeesService } from '@/users/employees.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeesService,
    private jwtService: JwtService,
  ) { }


  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.employeeService.findByEmail(email);
    const isValidPassword = await comparePasswordHelper(password, user.password);
    if (!user || !isValidPassword)
      return null;
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    console.log('Payload for JWT:', payload); // Log để kiểm tra payload
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
