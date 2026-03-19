export class RegisterUserResponseDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;

    constructor(partial: Partial<RegisterUserResponseDto>) {
        Object.assign(this, partial);
    }

    static fromUser(user: { id: number, email: string, firstName: string, lastName: string }) {
        return new RegisterUserResponseDto(user);
    }
}