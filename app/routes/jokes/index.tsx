import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { z } from "zod";
import { JokeModel } from "@prisma/zod";

import { db } from "~/utils/db.server";

const LoaderData = z.object({ randomJoke: JokeModel });

// eslint-disable-next-line @typescript-eslint/no-redeclare
type LoaderData = z.infer<typeof LoaderData>;

export const loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  const data: LoaderData = { randomJoke };
  return json(data);
};

export default function JokesIndexRoute() {
  const data = LoaderData.parse(useLoaderData());

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  );
}

export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>;
}
