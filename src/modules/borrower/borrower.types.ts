
export interface CreateBorrowerDTO {
    name: string;
    phone: string;
    mobile: string;
    createdBy: string;
    address: string;
}


export interface UpdateBorrowerDTO {
    name?: string;
    phone?: string;
    mobile?: string;
    address?: string;
}