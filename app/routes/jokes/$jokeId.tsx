import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { JokeModel } from "@prisma/zod";

import { db } from "~/utils/db.server";

const LoaderData = z.object({ joke: JokeModel });

// eslint-disable-next-line @typescript-eslint/no-redeclare
type LoaderData = z.infer<typeof LoaderData>;

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) throw new Error("Joke not found");
  const data: LoaderData = { joke };
  return json(data);
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">{data.joke.name} Permalink</Link>
    </div>
  );
}
