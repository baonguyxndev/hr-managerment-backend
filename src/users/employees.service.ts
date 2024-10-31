import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  create(createEmployeeDto: CreateEmployeeDto) {
    return 'This action adds a new Employee';
  }

  findAll() {
    return `This action returns all Employees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} Employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} Employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} Employee`;
  }
}
