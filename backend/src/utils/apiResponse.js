export function ok(res, data = {}, message = "") {
  return res.json({ success: true, data, message });
}

export function created(res, data = {}, message = "Created") {
  return res.status(201).json({ success: true, data, message });
}
