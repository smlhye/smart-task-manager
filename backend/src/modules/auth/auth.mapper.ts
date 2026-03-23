import { Prisma, User } from "@prisma/client";
import { RegisterDto, UserResponseDto } from "./dto/request.dto";

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

export function mapUserToDto(user: User): UserResponseDto {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth?.toISOString() || '',
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        avatarUrl: user.avatarUrl || '',
    }
}