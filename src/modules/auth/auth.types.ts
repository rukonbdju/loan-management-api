export interface RegisterUserDTO {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
}

export interface LoginUserDTO {
    email: string;
    password: string;
}

export interface JWTPayload {
    userId: string;
}
