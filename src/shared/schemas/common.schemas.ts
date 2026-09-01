import { z } from "zod";

export function serviceResultSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.discriminatedUnion("ok", [
    z.object({ ok: z.literal(true), data: dataSchema }),
    z.object({ ok: z.literal(false), error: z.string() }),
  ]);
}

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
