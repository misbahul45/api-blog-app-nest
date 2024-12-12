import { Injectable } from "@nestjs/common";
import { ZodType } from "zod";

@Injectable()
export class ZodService{
    validate<T>(schema:ZodType, data:T):T{
        return schema.parse(data)
    }
}