import { randomUUID } from "node:crypto";

export type ApiPerformanceMetrics = {
  databaseDurationMs: number;
  authenticationDurationMs: number;
  externalApiDurationMs: number;
  databaseQueries: number;
  authenticationChecks: number;
  externalRequests: number;
};

type ApiHandler<Args extends unknown[]> = (
  request: Request,
  metrics: ApiPerformanceMetrics,
  ...args: Args
) => Promise<Response>;

async function measure<T>(
  operation: () => Promise<T>,
  record: (durationMs: number) => void,
): Promise<T> {
  const startedAt = performance.now();
  try {
    return await operation();
  } finally {
    record(performance.now() - startedAt);
  }
}

export function measureDatabaseConnection<T>(
  metrics: ApiPerformanceMetrics,
  operation: () => Promise<T>,
): Promise<T> {
  return measure(operation, (durationMs) => {
    metrics.databaseDurationMs += durationMs;
  });
}

export function measureDatabaseQuery<T>(
  metrics: ApiPerformanceMetrics,
  operation: () => Promise<T>,
): Promise<T> {
  metrics.databaseQueries += 1;
  return measure(operation, (durationMs) => {
    metrics.databaseDurationMs += durationMs;
  });
}

export function measureExternalApi<T>(
  metrics: ApiPerformanceMetrics,
  operation: () => Promise<T>,
): Promise<T> {
  metrics.externalRequests += 1;
  return measure(operation, (durationMs) => {
    metrics.externalApiDurationMs += durationMs;
  });
}

export function measureAuthentication<T>(
  metrics: ApiPerformanceMetrics,
  operation: () => Promise<T>,
): Promise<T> {
  metrics.authenticationChecks += 1;
  return measure(operation, (durationMs) => {
    metrics.authenticationDurationMs += durationMs;
  });
}

export function withApiPerformance<Args extends unknown[]>(
  endpoint: string,
  handler: ApiHandler<Args>,
): (request: Request, ...args: Args) => Promise<Response> {
  return async (request, ...args) => {
    const suppliedRequestId = request.headers.get("x-request-id");
    const requestId =
      suppliedRequestId && /^[A-Za-z0-9._:-]{1,128}$/.test(suppliedRequestId)
        ? suppliedRequestId
        : randomUUID();
    const metrics: ApiPerformanceMetrics = {
      databaseDurationMs: 0,
      authenticationDurationMs: 0,
      externalApiDurationMs: 0,
      databaseQueries: 0,
      authenticationChecks: 0,
      externalRequests: 0,
    };
    const startedAt = performance.now();
    let response: Response | undefined;
    let responseSizeBytes: number | null = null;
    let error: string | null = null;

    try {
      response = await handler(request, metrics, ...args);
      response.headers.set("x-request-id", requestId);
      if (response.status >= 400) error = `http_${response.status}`;
      const contentLength = response.headers.get("content-length");
      responseSizeBytes =
        contentLength === null
          ? (await response.clone().arrayBuffer()).byteLength
          : Number(contentLength);
      return response;
    } catch (caught) {
      error = caught instanceof Error ? caught.name : "UnknownError";
      throw caught;
    } finally {
      console.info(
        JSON.stringify({
          request_id: requestId,
          endpoint,
          method: request.method,
          status: response?.status ?? 500,
          total_duration_ms: Number((performance.now() - startedAt).toFixed(2)),
          database_duration_ms: Number(metrics.databaseDurationMs.toFixed(2)),
          authentication_duration_ms: Number(
            metrics.authenticationDurationMs.toFixed(2),
          ),
          external_api_duration_ms: Number(
            metrics.externalApiDurationMs.toFixed(2),
          ),
          database_queries: metrics.databaseQueries,
          authentication_checks: metrics.authenticationChecks,
          external_requests: metrics.externalRequests,
          response_size_bytes: responseSizeBytes,
          error,
        }),
      );
    }
  };
}
