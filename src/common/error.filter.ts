import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ZodError } from "zod";

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      res.status(exception.getStatus()).json({
        success: false,
        message: exception.message || "An error occurred",
        data: null,
        errors: exception.getResponse(),
      });
    }
    else if (exception instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        data: null,
        errors: exception.errors.map((error) => ({
          path: error.path,
          message: error.message,
        })),
      });
    }else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: null,
        errors: exception.message || "Something went wrong",
      });
    }
  }
}
