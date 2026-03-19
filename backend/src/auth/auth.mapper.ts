import { Prisma } from "@prisma/client";
import { RegisterDto } from "./dto/request.dto";

export function mapDtoToUser(dto: RegisterDto, hashedPassword: string): Prisma.UserCreateInput {
    return {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
    };
}