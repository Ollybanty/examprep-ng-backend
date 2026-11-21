// Runs when no route matched the request
export function notFound(req, res) {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: `Cannot ${req.method} ${req.originalUrl}` },
  });
}
