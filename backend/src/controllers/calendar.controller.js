import * as service from "../services/calendar.service.js";
import { ok } from "../utils/apiResponse.js";

export const connect = async (_req, res) => ok(res, { url: service.getAuthUrl() });
export const callback = async (req, res) => {
  await service.saveOAuthCode(req.user._id, req.query.code);
  ok(res, {}, "Calendar connected");
};
export const syncTask = async (req, res) => ok(res, await service.syncTaskEvent(req.user._id, req.params.taskId), "Task synced");
