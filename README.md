# Ring API 🪐

A REST API featuring fictional planets and moons from **The Expanse** universe.

> 🚧 **Status:** in development. Not yet deployed — a live base URL will be added here once hosted.

## Tech Stack

- **[Fastify](https://fastify.dev/)** — fast and lightweight Node.js web framework
- **[Prisma 7](https://www.prisma.io/)** — type-safe ORM, using the new `prisma.config.ts` and driver adapters
- **[Supabase](https://supabase.com/)** (PostgreSQL) — hosted database
- **Swagger / OpenAPI** — interactive API documentation

## Features

- Read-only REST API for planets and moons
- Nested relational data (planets ↔ moons ↔ solar system)
- Full request/response validation via JSON Schema
- Auto-generated, interactive API docs (`/docs`)

## Usage

Once deployed, the API can be queried directly over HTTP — no authentication or setup required.

```bash
curl https://<base-url>/planets
curl https://<base-url>/planets/earth
curl https://<base-url>/moons
curl https://<base-url>/moons/luna
```

Full interactive documentation (Swagger UI) will be available at `https://<base-url>/docs`, where every endpoint can be explored and tested directly from the browser.

## API Endpoints

### `GET /`
Welcome route.

### `GET /planets`
Returns all planets, including their moons and solar system.

### `GET /planets/:planet`
Returns a single planet by name, with full details including moons and solar system.

**Example:** `GET /planets/earth`

### `GET /moons`
Returns all moons, including their parent planet.

### `GET /moons/:moon`
Returns a single moon by name, including its parent planet.

**Example:** `GET /moons/luna`

## Roadmap

- [ ] Deploy the API and publish the live base URL
- [ ] Add pagination and query filters (e.g. `?sortBy=`)
- [ ] Expand data coverage within The Expanse universe

## License

MIT
