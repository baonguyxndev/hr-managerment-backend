
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

  async login(email: string, password: string): Promise<any> {
    const employee = await this.employeeService.findByEmail(email);
    const isValidPassword = comparePasswordHelper(password, employee.password);
    if (!isValidPassword)
      throw new UnauthorizedException("Email/Password không hợp lệ");
    const payload = { sub: employee._id, email: employee.email };
    return {
      accessToken: await this.jwtService.signAsync(payload)
    }
  }
}
