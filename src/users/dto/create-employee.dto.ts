import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";

export class CreateEmployeeDto {

    @IsNotEmpty({ message: 'Vui lòng nhập email của bạn' })
    @IsEmail({}, { message: 'Vui lòng nhập đúng định dạng email' })
    email: string;

    @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu' })
    password: string;

    @IsOptional()
    name: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    image: string;
}
