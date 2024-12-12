export namespace AUTHTYPES {
    export type RegisterUser={
        name:string;
        email:string;
        password:string;
    }

    export type LoginUser={
        email:string;
        password:string;
    }
    export type RegisterResponse={
        id:string;
        name:string;
        email:string;
    }
    export type ValidateLocalLogin={
        id:string,
        name:string
    }
    export type AuthJwtPayload={
        sub:string
    }
}