import { Catch, ArgumentsHost, ExceptionFilter, Inject, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const request = ctx.getRequest<Request>()
        const response = ctx.getResponse<Response>()

        const status = exception instanceof HttpException ? exception.getStatus() : 500

        this.logger.error(`${request.method} ${request.url} ${status} ${exception.message}`);
        response.status(status).json({
            statusCode: status,
            message: exception.message
        });
    }
}