import * as z from "zod"
import * as imports from "../../app/zod-schemas"
import { CompleteUser, RelatedUserModel } from "./index"

export const JokeModel = z.object({
  id: z.string(),
  jokesterId: z.string(),
  createdAt: imports.dateSchema,
  updatedAt: imports.dateSchema,
  name: z.string(),
  content: z.string(),
})

export interface CompleteJoke extends z.infer<typeof JokeModel> {
  jokester: CompleteUser
}

/**
 * RelatedJokeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedJokeModel: z.ZodSchema<CompleteJoke> = z.lazy(() => JokeModel.extend({
  jokester: RelatedUserModel,
}))
