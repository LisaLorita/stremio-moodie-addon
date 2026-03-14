# Debugging guide – Movies not showing

## Steps to diagnose

### 1. Rebuild and restart the server

```bash
npm run build
npm run start:dev
```

### 2. When you click on a mood in Stremio, check the server logs

You should see something like:

```
[CatalogController] Petición recibida: type=movie, id=moods_catalog, genre=tears
[CatalogController] Obteniendo películas para mood: tears
[MovieService] Metas finales devueltos: 3 para mood tears
[CatalogController] Películas obtenidas: 3
[CatalogController] IDs de películas devueltas: tt123456, tt789012, tt345678
```

### 3. Manually test the request

```bash
# Test using the genre parameter
curl "https://moodie-addon.loca.lt/catalog/movie/moods_catalog.json?genre=tears"

# Or test directly from localhost
curl "http://localhost:3000/catalog/movie/moods_catalog.json?genre=tears"
```

**Check that it returns:**

- A JSON object with the `metas` property.
- A `metas` array with objects that contain:
  - `id`: in `tt123456` IMDb format.
  - `type`: `"movie"`.
  - `name`: Movie title.
  - `poster`: Image URL.
  - `description`: Description.

### 4. Check IMDb IDs

IDs must be in a valid IMDb format: `tt` followed by numbers. Example: `tt0111161`.

If you see IDs that don’t follow this format, movies will not show up in Stremio.

### 5. Look for errors in the logs

Search for lines that contain:

- `ERROR`
- `WARN`
- `No se encontraron películas válidas`
- `imdbId inválido`

### 6. Common issues

**Issue**: Logs show `"Metas finales devueltos: 0"`

- **Cause**: No movies found with a valid `imdb_id`.
- **Fix**: Check that the TMDB API is returning movies with `imdb_id`.

**Issue**: Logs show movies but Stremio doesn’t display them

- **Cause**: IDs are not valid or the response format is incorrect.
- **Fix**: Make sure the IDs are valid IMDb IDs (format `tt123456`).

**Issue**: Stremio shows `"the add-on providing this item has been removed"`

- **Cause**: Movie IDs are not recognized by Stremio.
- **Fix**: Ensure you are using valid and correctly formatted IMDb IDs.

### 7. If nothing works, test with a known movie ID

You can temporarily force a known ID to verify that the format works:

```bash
# En movie.service.ts, temporalmente devuelve una película conocida:
# Ejemplo: The Shawshank Redemption (tt0111161)
```

## Useful information when asking for help

1. Server logs when you click on a mood.
2. Result of the manual request with `curl`.
3. IDs of the movies being returned.
4. Exact error message in Stremio (if any).

