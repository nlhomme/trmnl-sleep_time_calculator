export default {
  async fetch(request) {
    const url = new URL(request.url);
    const minutes = parseInt(url.searchParams.get("m") || url.pathname.slice(1));

    if (!isNaN(minutes)) {
      const h = Math.floor((minutes % 1440) / 60);
      const m = minutes % 60;
      const time24 = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const period = h < 12 ? "AM" : "PM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const time12 = `${h12}:${String(m).padStart(2, "0")} ${period}`;

      if (request.headers.get("accept")?.includes("text/html")) {
        return new Response(html(time24, time12, minutes), { headers: { "content-type": "text/html" } });
      }
      return new Response(`${time24} (${time12})\n`);
    }

    return new Response(html(), { headers: { "content-type": "text/html" } });
  },
};

function html(result, result12, minutes) {
  return `<!DOCTYPE html>
<html><head><meta charset=utf-8><meta name=viewport content="width=device-width"><title>Minutes to Time</title>
<style>*{margin:0;font-family:system-ui}body{display:flex;justify-content:center;align-items:center;height:100vh;background:#111;color:#fff}form{text-align:center}input{font-size:2rem;width:6ch;text-align:center;background:#222;color:#fff;border:1px solid #444;border-radius:4px;padding:.2em}button{font-size:1.2rem;margin-left:.5em;padding:.3em .8em;background:#333;color:#fff;border:1px solid #444;border-radius:4px;cursor:pointer}p{margin-top:1em;font-size:3rem;font-variant-numeric:tabular-nums}label{font-size:1rem;color:#888}</style></head>
<body><form action="/" method=get>
<label>Minutes from 00:00</label><br><br>
<input name=m type=number value="${minutes ?? ""}" autofocus> <button>Go</button>
${result ? `<p>${result}</p><p style="font-size:1.5rem;color:#888">${result12}</p>` : ""}
</form></body></html>`;
}
