export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!result.success) {
    const error = new Error(result.error.issues.map((issue) => issue.message).join(", "));
    error.statusCode = 400;
    next(error);
    return;
  }
  req.validated = result.data;
  next();
};
