import { BadRequestException, Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, LOGIN_REQUEST } from 'src/types/api.types';
import { AUTHTYPES } from 'src/types/auth.types';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async create(@Body() values: AUTHTYPES.RegisterUser): Promise<ApiResponse<AUTHTYPES.RegisterResponse | null>> {
    try {
      const result=await this.authService.registerUser(values);
      return{
        success:true,
        message:'User created successfully',
        data:result,
        errors:null
      }
    } catch (error) {
      throw new BadRequestException("User already register");
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req:LOGIN_REQUEST){
    const data=await this.authService.login(req.user.id, req.user.name);
    return {
      success: true,
      message: 'Login successful',
      data,
      errors:null
    };    
  }

  @Get("jwt")
  @UseGuards(JwtAuthGuard)
  getAll(){
    return {
      success: true,
      message: 'Protected route',
      data: null,
      errors: null
    }
  }

  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Request() req){
   return this.authService.refreshToken(req.user.id, req.user.name) 
  }
}
