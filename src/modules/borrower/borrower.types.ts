
export interface CreateBorrowerType {
    name: string;
    phone: string;
    mobile: string;
    nid: string;
    createdBy: string;
    address: string;
}


export interface UpdateBorrowerType {
    name?: string;
    phone?: string;
    mobile?: string;
    nid?: string;
    address?: string;
}