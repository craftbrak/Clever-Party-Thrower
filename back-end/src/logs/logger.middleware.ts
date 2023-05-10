import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    const { ip, originalUrl, body } = req;
    // const userAgent = req.get("user-agent") || "";

    res.on("finish", () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length");

      this.logger.debug(
        `${originalUrl} ${body.operationName} ${statusCode} ${contentLength} - ${ip}`,
      );
    });

    next();
  }
}
