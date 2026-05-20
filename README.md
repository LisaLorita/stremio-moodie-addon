# 🎬 Stremio Mood Movies Addon

Stop scrolling through endless catalogs.

Get **3 movie recommendations instantly** based on your mood.

Addon for **Stremio** that gives you **three quick recommendations** based on how you feel at that moment.

The addon is built with **NestJS** and uses the **TMDB** API to fetch real movie data.

---

<!-- ## 🔗 Live Demo

Install the addon directly in Stremio using the manifest:
[https://stremio-moodie-addon.onrender.com/manifest.json](https://stremio-moodie-addon.onrender.com/manifest.json) -->

# ✨ Features

- 🎭 Recommendations based on **mood**
- 🎬 Returns **3 automatically selected movies**
- ⚡ Fast backend with **NestJS**
- 🔌 Compatible with the official **Stremio addon system**
- 🌍 Movie data fetched from **TMDB**
- ⏱ Designed to **avoid endless catalog scrolling**

---

## 🎯 Purpose

This addon was created to reduce decision fatigue when choosing movies. Instead of browsing large catalogs, users receive **three quick suggestions** aligned with their mood, demonstrating a full-stack project with API integration, backend logic, and frontend consumption in Stremio.

---

# 🧠 How it works

1. The user selects a **mood**.
2. The addon queries **TMDB**.
3. **3 recommended movies** are selected for that mood.
4. Stremio shows those three options directly.

The goal is to offer **quick decisions**, not huge catalogs.

---

## How recommendations are generated

The addon generates movie recommendations based on the user's mood.

Instead of returning a large catalog, the goal is to provide **3 curated movie options** so the user can start watching quickly without scrolling through hundreds of titles.

### Recommendation flow

1. The user selects a **mood category** in Stremio.
2. Stremio requests the catalog endpoint:

   /catalog/movie/{mood}.json

3. The backend maps the selected mood to one or more **movie genres**.
4. The server queries the TMDB API to retrieve popular or relevant titles.
5. The results are filtered and **3 movies are selected**.
6. The addon returns those movies as a Stremio catalog response.

### Mood → Genre mapping

Example mapping used by the addon:

| Mood       | TMDB genres used |
| ---------- | ---------------- |
| happy      | Comedy, Family   |
| sad        | Drama            |
| romantic   | Romance          |
| thrilling  | Thriller, Action |
| thoughtful | Drama, Mystery   |

## `manifest`

Describes the addon to Stremio.

Endpoint:

```bash
GET /manifest.json
```

Includes:

- addon id
- name
- version
- supported resources
- content types
- available catalogs

---

## `catalog`

Returns **three recommended movies** for a given mood.

Example:

```bash
GET /catalog/movie/happy.json
```

Simplified response:

```json
{
  "metas": [
    {
      "id": "tmdb:550",
      "type": "movie",
      "name": "Example Movie",
      "poster": "https://image.tmdb.org/t/p/w500/..."
    },
    {
      "id": "tmdb:551",
      "type": "movie",
      "name": "Example Movie 2",
      "poster": "https://image.tmdb.org/t/p/w500/..."
    },
    {
      "id": "tmdb:552",
      "type": "movie",
      "name": "Example Movie 3",
      "poster": "https://image.tmdb.org/t/p/w500/..."
    }
  ]
}
```

---

# 🧰 Tech stack

- Node.js
- NestJS
- TypeScript
- Stremio Addon Protocol
- TMDB API

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/LisaLorita/stremio-mood-addon.git
cd stremio-mood-addon
```

Install dependencies:

```bash
npm install
```

---

# 🚀 Run the project

## Development

```bash
npm run start:dev
```

The server will usually start at:

```
http://localhost:3000
```

---

## Production

```bash
npm run build
npm run start:prod
```

---

# 🔌 Install the addon in Stremio

<!-- You can install the live addon directly without running it locally:

Manifest URL (hosted on Render):
https://stremio-moodie-addon.onrender.com/manifest.json -->

To install locally:

1. Run the server locally.
2. Open **Stremio**.
3. Go to **Addons → Community Addons**.
4. Add the addon using the manifest URL:

```
http://localhost:3000/manifest.json
```

Once installed:

Recommendations appear directly on the Home page as separate lists for each mood.

You can also find them in Discover → the second dropdown menu, under mood-based categories.

This allows users to quickly see 3 curated movies without scrolling through the full catalog.

---

# 🧪 Tests

Unit tests:

```bash
npm run test
```

End-to-end tests:

```bash
npm run test:e2e
```

Coverage:

```bash
npm run test:cov
```

---

# 🐞 Debugging

If no movies appear in Stremio:

1. Check that the server is running.
2. Verify that `manifest.json` responds correctly.
3. Inspect the server logs.
4. Confirm that the TMDB API responds correctly.

Full guides:

```
docs/debugging.md
docs/logs.md
```

---

# 👩‍💻 Author

Alba M  
GitHub: https://github.com/LisaLorita
