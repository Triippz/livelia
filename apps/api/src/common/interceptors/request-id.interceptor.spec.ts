import { Test, TestingModule } from '@nestjs/testing';
import { RequestIdInterceptor } from './request-id.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { REQUEST_ID_TOKEN_HEADER } from '../../modules/auth/constants/header.constants';
import { FastifyRequest, FastifyReply } from 'fastify';

describe('RequestIdInterceptor', () => {
  let interceptor: RequestIdInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestIdInterceptor],
    }).compile();

    interceptor = module.get<RequestIdInterceptor>(RequestIdInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should set a new request ID if not present', done => {
    const context = createMockExecutionContext({});
    const next = createMockCallHandler();

    interceptor.intercept(context, next).subscribe(() => {
      const req = context.switchToHttp().getRequest<FastifyRequest>();
      const res = context.switchToHttp().getResponse<FastifyReply>();
      expect(req.headers[REQUEST_ID_TOKEN_HEADER]).toBeDefined();
      expect(res.header).toHaveBeenCalledWith(
        REQUEST_ID_TOKEN_HEADER,
        req.headers[REQUEST_ID_TOKEN_HEADER],
      );
      done();
    });
  });

  it('should preserve existing valid request ID', done => {
    const existingRequestId = uuidv4();
    const context = createMockExecutionContext({
      [REQUEST_ID_TOKEN_HEADER]: existingRequestId,
    });
    const next = createMockCallHandler();

    interceptor.intercept(context, next).subscribe(() => {
      const req = context.switchToHttp().getRequest<FastifyRequest>();
      const res = context.switchToHttp().getResponse<FastifyReply>();
      expect(req.headers[REQUEST_ID_TOKEN_HEADER]).toBe(existingRequestId);
      expect(res.header).toHaveBeenCalledWith(
        REQUEST_ID_TOKEN_HEADER,
        existingRequestId,
      );
      done();
    });
  });

  function createMockExecutionContext(headers: any): ExecutionContext {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers,
        }),
        getResponse: jest.fn().mockReturnValue({
          header: jest.fn(),
        }),
      }),
    } as unknown as ExecutionContext;
  }

  function createMockCallHandler(): CallHandler {
    return {
      handle: jest.fn().mockReturnValue(of(null)),
    } as unknown as CallHandler;
  }
});
