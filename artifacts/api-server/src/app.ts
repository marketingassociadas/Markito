import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import { originGuard, sessionSecret } from "./lib/security";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
app.disable("x-powered-by");
// Trust only the nearest reverse proxy; never take the first forwarded IP.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use("/api", originGuard);
app.use(express.json({ limit: "32kb" }));
app.use(cookieParser(sessionSecret));
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  next();
});

app.use("/api", router);
app.use(((err, req, res, _next) => {
  req.log.error({ err }, "Request failed");
  if (res.headersSent) { res.end(); return; }
  const status = err.status === 413 ? 413 : err instanceof SyntaxError ? 400 : 500;
  res.status(status).json({ error: status === 413 ? "Mensagem muito grande" : status === 400 ? "JSON inválido" : "Serviço indisponível. Tente novamente." });
}) as import("express").ErrorRequestHandler);

export default app;
