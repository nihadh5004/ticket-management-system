export interface ILoginPayload {
    username: string;
    password : string;
}

export interface IRegisterPayload {
    username: string;
    email: string;
    password : string;
    confirm_password:string;
}

export interface IRegisterRes {
    username: string;
    email: string;
    id : string;
    is_active?: boolean;

}

export interface ILoginRes {
    access: string;
    refresh : string;
    user_type:string;
}