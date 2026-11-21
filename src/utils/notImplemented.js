// Placeholder for unbuilt endpoints: delete the call when you build one
export function notImplemented(res) {
  return res.status(501).json({
    error: { code: 'NOT_IMPLEMENTED', message: 'This endpoint has not been built yet' },
  });
}
