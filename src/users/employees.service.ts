import { hashPasswordHelper } from '@/helpers/util';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './schemas/employees.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

@Injectable()
export class EmployeesService {
  constructor(@InjectModel(Employee.name) private employeesModule: Model<Employee>) { }

  isEmailExist = async (email: string) => {
    const employee = await this.employeesModule.exists({ email })
    if (employee)
      return true
    return false
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { name, email, password, phone, address, image } = createEmployeeDto;

    //kiểm tra email có tồn tại hay kh
    const isExist = await this.isEmailExist(email)
    if (isExist)
      throw new BadRequestException(`email "${email}" đã tồn tại`)


    //hash password
    const hashPassword = await hashPasswordHelper(password)
    const employee = await this.employeesModule.create({
      name, email, password: hashPassword, phone, address, image
    })
    return {
      _id: employee._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query)

    if (filter.current)
      delete filter.current;
    if (filter.pageSize)
      delete filter.pageSize;

    if (!current)
      current = 1;
    if (!pageSize)
      pageSize = 10;

    const totalItems = (await this.employeesModule.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const results = await this.employeesModule
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password") // không hiển thị mật khẩu của ng dùng lên respone
      .sort(sort as any);

    return { results, totalPages };
  }

  async findByEmail(email: string) {
    return await this.employeesModule.findOne({ email })
  }

  async update(updateEmployeeDto: UpdateEmployeeDto) {
    return await this.employeesModule.updateOne(
      { _id: updateEmployeeDto._id }, { ...updateEmployeeDto })
  }

  remove(_id: string) {
    //check id
    if (mongoose.isValidObjectId(_id)) {
      //delete
      return this.employeesModule.deleteOne({ _id })
    } else {
      throw new BadRequestException("Id không đúng định dạng mongodb")
    }
  }
}
