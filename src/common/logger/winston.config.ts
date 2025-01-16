import { utilities, WinstonModuleOptions } from "nest-winston";
import * as winston from "winston";

export const winstonConfig: WinstonModuleOptions = {
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
                utilities.format.nestLike('E-Commerce', {
                    prettyPrint: true,
                    colors: true
                })
            ),
        }),
        new winston.transports.File({filename: 'logs/combined.log'}),
        new winston.transports.File({filename: 'logs/error.log', level: 'error'})
    ]
}