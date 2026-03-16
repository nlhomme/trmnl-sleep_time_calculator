# trmnl-sleep_time_calculator

A lightweight Cloudflare Worker that converts minutes (from 00:00) into a time of day.

**Live demo:** https://sleep-time-calculator.goulash-rafts-06.workers.dev

## Usage

### curl / API

```sh
# Query parameter
curl "https://your-worker.dev/?m=1325"
# 22:05 (10:05 PM)

# Path style
curl "https://your-worker.dev/1325"
# 22:05 (10:05 PM)
```

Returns plain text with both 24h and 12h formats.

### Browser

Open the URL in a browser to get a minimal form where you can input minutes and see the result in both 24h and 12h (AM/PM) formats.

## Local development

```sh
npx wrangler dev
```

This starts a local server at `http://localhost:8787`.

## Deploy

```sh
npx wrangler deploy
```

## License

[MIT](LICENSE)
