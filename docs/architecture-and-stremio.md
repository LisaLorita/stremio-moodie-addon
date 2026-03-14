## Mood navigation problem in Stremio

Stremio loads the list of moods correctly, but when you click on a mood, in many cases it **does not perform any additional request to the server**. This strongly influences how the addon's user experience can be designed.

### Functional problem

- Stremio shows moods in the initial catalog.
- When clicking on a mood, it sometimes does not trigger backend requests (depending on how the manifest and IDs are modeled).
- Also, if movie IDs do not have the correct format (for example `tttt5420886`), Stremio ignores those items even if they are returned in the response.

### Design solutions considered

#### Solution 1: Show movies directly (RECOMMENDED)

Instead of showing navigable moods, show random movies from all moods when the catalog is loaded:

- **Pros**
  - Works immediately.
  - Does not require additional navigation in Stremio.
  - Simpler implementation.
- **Cons**
  - No visual separation by mood.
  - The user cannot pick a specific mood inside Stremio.

#### Solution 2: Use multiple catalogs

Create a separate catalog for each mood in the manifest:

- **Pros**
  - Each mood appears as an independent catalog.
  - Stremio automatically navigates between catalogs.
- **Cons**
  - Many catalogs in the manifest (one per mood).
  - Higher maintenance complexity.

#### Solution 3: Use an extra parameter (`genre`)

Keep a single catalog with `extra: [{ name: 'genre', isRequired: false }]` and have moods use that parameter.

- **Problem detected**
  - In practice, Stremio does not always send the `genre` parameter when clicking on moods, so the backend does not receive enough information to filter.

### Technical adjustments implemented

1. **Correct IMDb ID format**
   - Validate whether `imdb_id` already includes the `tt` prefix before adding it.
   - Avoid generating IDs such as `tttt5420886`.
   - Filter out movies without a valid `imdb_id` or with an invalid `poster_path`.

2. **Flexible handling of catalog requests**
   - The `CatalogController` supports:
     - Requests using the `genre` parameter (for example `/catalog/movie/moods_catalog.json?genre=think`).
     - Requests using the mood ID directly (for example `/catalog/movie/mood:think.json`).

3. **Future options**
   - Change the mood IDs format (for example directly using `id: "think"` and letting the controller detect it as a mood).
   - Implement the `meta` resource in the manifest (`resources: ['catalog', 'meta']`) with a dedicated `MetaController` for more advanced mood navigation.

