import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ZodService } from 'src/common/zod.service';
import * as bcrypt from 'bcrypt';
import { AUTHTYPES } from 'src/types/auth.types';
import { AUTHVALIDATION } from './auth.validation';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';


@Injectable()
export class AuthService {
    constructor(
        private readonly prisma:PrismaService,
        private readonly validation:ZodService,
        private readonly jwtService:JwtService,
        @Inject(refreshConfig.KEY) private readonly refresToken:ConfigType<typeof refreshConfig>
    ){}

    async registerUser(values:AUTHTYPES.RegisterUser):Promise<AUTHTYPES.RegisterResponse | null>{
        try {
            const findUser=await this.prisma.user.count({
                where:{
                    email:values.email
                }
            })
            if(findUser>0){
                throw new ConflictException('User already exists');
            }

            const registerRequest=this.validation.validate(AUTHVALIDATION.RegisterValidation,values);

            registerRequest.password=await bcrypt.hash(registerRequest.password,10);
            const user=await this.prisma.user.create({
                data:{
                    name:registerRequest.name,
                    email:registerRequest.email,
                    password:registerRequest.password
                },
                select:{
                    id:true,
                    name:true,
                    email:true
                }
            });
            return user;
        } catch (error) {
            throw error
        }
    }

    async validateLocalUser(values:AUTHTYPES.LoginUser):Promise<AUTHTYPES.ValidateLocalLogin | null>{
        const isValid=this.validation.validate(AUTHVALIDATION.LoginValidation, values)

        const user=await this.prisma.user.findUnique({
            where:{
                email:isValid.email
            }
        })

        if(!user){
          throw new NotFoundException("User not found")
        }
        const isMatch=await bcrypt.compare(isValid.password, user.password);
        if(!isMatch){
            throw new UnauthorizedException("Invalid credential")
        }

        return {
            id:user.id,
            name:user.name
        }
    }

    async login(userId:string, name:string){
        const { accessToken, refreshToken }=await this.generateToken(userId)
        return{
            id:userId,
            name,
            accessToken,
            refreshToken
        }
    }

    async generateToken(userId:string){
        const payload:AUTHTYPES.AuthJwtPayload={ sub:userId }
        const [accessToken, refreshToken]=await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refresToken)
        ])

        return{
            accessToken,
            refreshToken
        }

    }

    async validateJwtUser(userId:string){
        const user=await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        if(!user){
            throw new NotFoundException("User not found")
        }

        return {
            id:user.id,
            name:user.name
        } 
    }
    async validateRefreshToken(userId:string){
        const user=await this.prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        if(!user){
            throw new NotFoundException("User not found")
        }

        return {
            id:user.id,
            name:user.name
        } 
    }

    async refreshToken(userId:string, name:string){
        const { accessToken, refreshToken }=await this.generateToken(userId)
        return{
            id:userId,
            name,
            accessToken,
            refreshToken
        }
    }
}
