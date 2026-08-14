# Ring API 🪐

A REST API featuring fictional planets and moons from **The Expanse** universe.

**Live at:** [`ringapi.onrender.com`](https://ringapi.onrender.com) · **Docs:** [`ringapi.onrender.com/docs`](https://ringapi.onrender.com/docs)

## Tech Stack

- **[Fastify](https://fastify.dev/)** — fast and lightweight Node.js web framework
- **[Prisma 7](https://www.prisma.io/)** — type-safe ORM, using the new `prisma.config.ts` and driver adapters
- **[Supabase](https://supabase.com/)** (PostgreSQL) — hosted database
- **Swagger / OpenAPI** — interactive API documentation

## Features

- Read-only REST API for planets and moons
- Nested relational data (planets ↔ moons ↔ solar system)
- Case-insensitive lookups by name
- Full request/response validation via JSON Schema
- Auto-generated, interactive API docs (`/docs`)

## Usage

The API can be queried directly over HTTP — no authentication or setup required.

```bash
curl https://ringapi.onrender.com/planets
curl https://ringapi.onrender.com/planets/earth
curl https://ringapi.onrender.com/moons
curl https://ringapi.onrender.com/moons/luna
```

Full interactive documentation (Swagger UI) is available at [`ringapi.onrender.com/docs`](https://ringapi.onrender.com/docs), where every endpoint can be explored and tested directly from the browser.

> Hosted on Render's free tier — the first request after a period of inactivity may take 30-60 seconds while the server wakes up.

## About the Data

Data is sourced from [The Expanse Wiki](https://expanse.fandom.com/) and covers planets and moons within the Sol system as depicted in the books and TV series.

A few fields worth clarifying:

| Field | Meaning |
|---|---|
| `diameter` | Equatorial diameter, in kilometers |
| `gravity` | Surface gravity, relative to Earth (1 = Earth's gravity) |
| `length_of_day` | Length of one full rotation, in Earth days |
| `length_of_year` | Length of one orbit around the Sun — stored as free text (e.g. `"365.25 days"`, `"1.9 years"`), since the source material doesn't always express it in the same unit |
| `atmospheric_pressure` | Surface atmospheric pressure — stored as free text since units vary by source (e.g. `"9.2MPa"`, `"20-200 kPa"`, `"1"` for Earth-relative) |
| `atmospheric_composition` | Breakdown of major atmospheric gases, by percentage |
| `temperature_min` / `avg` / `max` | Surface temperature range, in °C |
| `demonym` | Term used for inhabitants (e.g. `"Earther"`, `"Martian"`) |
| `population` | Free text — often a number, but sometimes a note where in-universe sources disagree (e.g. book vs. TV canon) |
| `colonized` | Whether the body has an active human settlement |

> **Note:** some numeric-looking fields (`length_of_year`, `atmospheric_pressure`, `population`) are stored as text rather than numbers, since the source data isn't consistently formatted across bodies. This is a known simplification — see [Roadmap](#roadmap).

## API Endpoints

### `GET /`
Welcome route.

### `GET /planets`
Returns all planets, including their moons and solar system.

### `GET /planets/:planet`
Returns a single planet by name (case-insensitive), with full details including moons and solar system.

**Example:** `GET /planets/earth`

### `GET /moons`
Returns all moons, including their parent planet.

### `GET /moons/:moon`
Returns a single moon by name (case-insensitive), including its parent planet.

**Example:** `GET /moons/luna`

## Roadmap

- [x] Deploy the API and publish the live base URL
- [ ] Normalize `length_of_year` / `atmospheric_pressure` into consistent numeric units
- [ ] Add pagination and query filters (e.g. `?sortBy=`)
- [ ] Expand data coverage within The Expanse universe

## License

MIT
