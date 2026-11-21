// Prints one line per request, e.g.  POST /api/v1/auth/login → 200 (12ms)
export function logger(req, res, next) {
  const start = Date.now();

  // 'finish' runs after the response is sent, so the status code is known
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });

  next();
}
