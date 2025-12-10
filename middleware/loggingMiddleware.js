/**
 * Request logging middleware
 * Logs all incoming requests with method, URL, and response time
 */

const logRequest = (req, res, next) => {
  const startTime = Date.now();
  const { method, url, ip } = req;

  // Log request details
  console.log(`[${new Date().toISOString()}] ${method} ${url} from ${ip}`);

  // Track response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;
    const statusColor = statusCode >= 400 ? '❌' : '✓';

    console.log(
      `${statusColor} ${statusCode} - ${duration}ms`
    );
  });

  next();
};

const logError = (err, req, res, next) => {
  console.error(
    `[ERROR] ${req.method} ${req.url} - ${err.message}`
  );
  next(err);
};

module.exports = {
  logRequest,
  logError,
};
