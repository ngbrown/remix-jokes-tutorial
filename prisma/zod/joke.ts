import * as z from "zod"
import * as imports from "../../app/zod-schemas"

export const JokeModel = z.object({
  id: z.string(),
  createdAt: imports.dateSchema,
  updatedAt: imports.dateSchema,
  name: z.string(),
  content: z.string(),
})
