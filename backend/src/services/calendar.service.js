import { google } from "googleapis";
import { CalendarAccount } from "../models/CalendarAccount.js";
import { Task } from "../models/Task.js";

function oauthClient() {
  return new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
}

export function getAuthUrl() {
  return oauthClient().generateAuthUrl({ access_type: "offline", scope: ["https://www.googleapis.com/auth/calendar.events"] });
}

export async function saveOAuthCode(userId, code) {
  const client = oauthClient();
  const { tokens } = await client.getToken(code);
  await CalendarAccount.findOneAndUpdate({ userId }, { userId, accessToken: tokens.access_token, refreshToken: tokens.refresh_token, expiryDate: tokens.expiry_date }, { upsert: true, new: true });
}

export async function syncTaskEvent(userId, taskId) {
  const account = await CalendarAccount.findOne({ userId });
  const task = await Task.findOne({ _id: taskId, createdBy: userId });
  if (!account || !task?.dueDate) return { connected: Boolean(account), task };
  const client = oauthClient();
  client.setCredentials({ access_token: account.accessToken, refresh_token: account.refreshToken, expiry_date: account.expiryDate });
  const calendar = google.calendar({ version: "v3", auth: client });
  const event = { summary: task.title, description: task.description, start: { dateTime: task.dueDate }, end: { dateTime: new Date(new Date(task.dueDate).getTime() + 30 * 60_000).toISOString() } };
  const response = task.calendarEventId
    ? await calendar.events.update({ calendarId: "primary", eventId: task.calendarEventId, requestBody: event })
    : await calendar.events.insert({ calendarId: "primary", requestBody: event });
  task.calendarEventId = response.data.id;
  await task.save();
  return { connected: true, eventId: task.calendarEventId };
}
