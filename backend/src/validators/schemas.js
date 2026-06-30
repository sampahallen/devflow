import { z } from "zod";

export const idParam = z.object({ params: z.object({ id: z.string().min(1) }) });
export const projectQuery = z.object({ query: z.object({ projectId: z.string().optional(), q: z.string().optional() }).passthrough() });
export const registerSchema = z.object({ body: z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) }) });
export const loginSchema = z.object({ body: z.object({ email: z.string().email(), password: z.string().min(1) }) });
export const refreshSchema = z.object({ body: z.object({ refreshToken: z.string().min(1) }) });
export const projectSchema = z.object({ body: z.object({ name: z.string().min(1), description: z.string().optional(), color: z.string().optional() }) });
export const taskSchema = z.object({ body: z.object({ title: z.string().min(1), description: z.string().optional(), priority: z.enum(["low", "medium", "high"]).optional(), status: z.enum(["todo", "in-progress", "review", "done"]).optional(), dueDate: z.string().optional(), assignee: z.string().optional(), githubUrl: z.string().optional(), resourceLinks: z.array(z.string()).optional(), markdownFiles: z.array(z.string()).optional(), targetPomodoros: z.number().optional(), position: z.number().optional(), projectId: z.string().min(1) }) });
export const promptSchema = z.object({ body: z.object({ title: z.string().min(1), content: z.string().min(1), category: z.string().optional(), tags: z.array(z.string()).optional(), favorite: z.boolean().optional(), projectId: z.string().min(1) }) });
export const resourceSchema = z.object({ body: z.object({ title: z.string().min(1), url: z.string().url(), category: z.string().optional(), notes: z.string().optional(), projectId: z.string().min(1) }) });
export const noteSchema = z.object({ body: z.object({ title: z.string().min(1), path: z.string().min(1), content: z.string().optional(), tags: z.array(z.string()).optional(), projectId: z.string().min(1) }) });
export const pomodoroSchema = z.object({ body: z.object({ projectId: z.string().min(1), taskId: z.string().optional(), minutes: z.number().min(1).default(25) }) });
