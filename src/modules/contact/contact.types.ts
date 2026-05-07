export interface CreateContactDTO {
    name: string;
    phone: string;
    mobile: string;
    createdBy: string;
    address: string;
}

export interface UpdateContactDTO {
    name?: string;
    phone?: string;
    mobile?: string;
    address?: string;
}