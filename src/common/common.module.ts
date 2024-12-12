import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ZodService } from './zod.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';

@Global()
@Module({
    providers:[PrismaService, ZodService,
        {
            provide:APP_FILTER,
            useClass:ErrorFilter
        }
    ],
    exports:[PrismaService, ZodService],
})
export class CommonModule {}
