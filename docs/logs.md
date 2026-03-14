# How to inspect server logs

## Steps to see the logs

### 1. Open a terminal and go to the project folder

```bash
cd /home/albamg/personal/Stremio/stremio-moodie-addon
```

### 2. Build the project (if there are changes)

```bash
npm run build
```

### 3. Start the server in development mode

```bash
npm run start:dev
```

**IMPORTANT**: Logs will appear in this same terminal. You will see messages like:

- `[Nest] INFO` – General information.
- `[Nest] WARN` – Warnings.
- `[Nest] ERROR` – Errors.
- `[CatalogController]` – Controller logs.
- `[MovieService]` – Service logs.

### 4. In another terminal, start localtunnel

```bash
lt --port 3000 --subdomain moodie-addon
```

### 5. If the server crashes

Logs will show the exact error. Look for lines that contain:

- `ERROR`
- `Error:`
- `Exception:`
- Stack traces.

### 6. Manually test the endpoints (optional)

You can hit the URLs directly:

```bash
# Test the manifest
curl http://localhost:3000/manifest.json

# Test the catalog without mood
curl http://localhost:3000/catalog/movie/moods_catalog.json

# Test the catalog with a mood
curl "http://localhost:3000/catalog/movie/moods_catalog.json?genre=tears"
```

## Common issues

1. **Port 3000 already in use**

   ```bash
   lsof -i :3000  # Ver qué está usando el puerto
   kill -9 <PID>  # Matar el proceso si es necesario
   ```

2. **The server does not start**

- Check build logs and errors in the terminal.

3. **Localtunnel crashes**

- Make sure the server is running **before** starting localtunnel.

