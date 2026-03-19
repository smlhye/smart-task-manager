import { HttpStatus, Injectable } from "@nestjs/common";
import { AuthRepository } from "./auth.repository";
import { RegisterDto } from "./dto/register.dto";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import * as bcrypt from 'bcryptjs';
import { mapDtoToUser } from "./auth.mapper";
import { RegisterUserResponseDto } from "./dto/user-response.dto";

@Injectable()
export class AuthService {
    constructor(private readonly authRepo: AuthRepository) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.authRepo.findByEmail(dto.email, { select: { id: true } });

        if (existingUser) {
            throw new BaseException({
                code: ErrorCode.USER_EMAIL_EXISTS,
                message: 'Email already exists',
                status: HttpStatus.CONFLICT,
            })
        }

        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const userData = mapDtoToUser(dto, hashedPassword);
        const user = await this.authRepo.create(userData, {
            select: { id: true, email: true, firstName: true, lastName: true, }
        });
        return RegisterUserResponseDto.fromUser(user);
    }
}