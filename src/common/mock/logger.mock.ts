import { WINSTON_MODULE_PROVIDER } from "nest-winston";

export const LoggerMock = {
    provide: WINSTON_MODULE_PROVIDER,
    useValue: {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn()
    }
}