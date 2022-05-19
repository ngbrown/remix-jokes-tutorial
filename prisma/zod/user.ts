import * as z from "zod"
import * as imports from "../../app/zod-schemas"
import { CompleteJoke, RelatedJokeModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  createdAt: imports.dateSchema,
  updatedAt: imports.dateSchema,
  username: z.string(),
  passwordHash: z.string(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  jokes: CompleteJoke[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  jokes: RelatedJokeModel.array(),
}))
