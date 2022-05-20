import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, Link, useLoaderData, Form } from "@remix-run/react";
import { z } from "zod";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

import stylesUrl from "~/styles/jokes.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

const LoaderData = z.object({
  user: z.object({ id: z.string(), username: z.string() }).nullable(),
  jokeListItems: z.array(z.object({ id: z.string(), name: z.string() })),
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
type LoaderData = z.infer<typeof LoaderData>;

export const loader: LoaderFunction = async ({ request }) => {
  let jokeListItems = await db.joke.findMany({
    take: 10,
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });
  const user = await getUser(request);

  const data: LoaderData = {
    jokeListItems: jokeListItems,
    user,
  };
  return json(data);
};

export default function JokesRoute() {
  const data = LoaderData.parse(useLoaderData());

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
          {data.user ? (
            <div className="user-info">
              <span>{`Hi ${data.user.username}`}</span>
              <Form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </Form>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokeListItems.map((joke) => (
                <li key={joke.id}>
                  <Link prefetch="intent" to={joke.id}>
                    {joke.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
