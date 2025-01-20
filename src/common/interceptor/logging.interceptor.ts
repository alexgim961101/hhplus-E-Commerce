import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Observable, tap } from "rxjs";
import { Logger } from "winston";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;


        const now = Date.now();

        return next.handle().pipe(
            tap(() => {
                const response = context.switchToHttp().getResponse();
                const responseTime = Date.now() - now;
                this.logger.info(`${method} ${url} ${request.ip} ${response.statusCode} ${responseTime}ms`);
            })
        )
    }
}