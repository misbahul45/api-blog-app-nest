export class ApiResponse<T> {
    data: T | null;
    message: string;
    success: boolean;
    errors: any | null;
}

export interface LOGIN_REQUEST extends Request{
    user?:{
        id:string
        name:string
    }
} 