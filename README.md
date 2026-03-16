# trmnl-sleep_time_calculator

A lightweight Cloudflare Worker that converts between minutes and time of day, in both directions.

**Live demo:** https://sleep-time-calculator.goulash-rafts-06.workers.dev

## Usage

### curl / API

```sh
# Minutes to time
curl "https://your-worker.dev/1325"
# 22:05 (10:05 PM)

# Time to minutes (24h)
curl "https://your-worker.dev/6:30"
# 390 minutes

curl "https://your-worker.dev/22:05"
# 1325 minutes

# Time to minutes (AM/PM)
curl "https://your-worker.dev/?t=10:05&ampm=pm"
# 1325 minutes
```

You can also use query parameters: `?m=1325` or `?t=22:05`. Add `&ampm=am` or `&ampm=pm` for 12h input.

### Browser

Open the URL in a browser to get a minimal UI with both converters: minutes to time (24h + AM/PM) and time to minutes with an AM/PM/24h toggle.

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
