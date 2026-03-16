export default {
  async fetch(request) {
    const url = new URL(request.url);
    const param = url.searchParams.get("m") || url.searchParams.get("t") || url.pathname.slice(1);
    const ampm = url.searchParams.get("ampm");
    const isHtml = request.headers.get("accept")?.includes("text/html");

    // Time to minutes: e.g. ?t=22:05 or /22:05
    const timeMatch = param.match(/^(\d{1,2}):(\d{2})(:\d{2})?$/);
    if (timeMatch) {
      let h = parseInt(timeMatch[1]);
      const m = parseInt(timeMatch[2]);
      if (ampm === "pm" && h < 12) h += 12;
      if (ampm === "am" && h === 12) h = 0;
      if (h < 24 && m < 60) {
        const totalMinutes = h * 60 + m;
        if (isHtml) {
          return new Response(html({ minutes: totalMinutes, timeInput: param, ampm }), { headers: { "content-type": "text/html" } });
        }
        return new Response(`${totalMinutes} minutes\n`);
      }
    }

    // Minutes to time: e.g. ?m=1325 or /1325
    const minutes = parseInt(param);
    if (!isNaN(minutes)) {
      const h = Math.floor((minutes % 1440) / 60);
      const m = minutes % 60;
      const time24 = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const period = h < 12 ? "AM" : "PM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const time12 = `${h12}:${String(m).padStart(2, "0")} ${period}`;

      if (isHtml) {
        return new Response(html({ time24, time12, minutesInput: minutes }), { headers: { "content-type": "text/html" } });
      }
      return new Response(`${time24} (${time12})\n`);
    }

    return new Response(html({}), { headers: { "content-type": "text/html" } });
  },
};

function html({ time24, time12, minutes, minutesInput, timeInput, ampm } = {}) {
  return `<!DOCTYPE html>
<html><head><meta charset=utf-8><meta name=viewport content="width=device-width"><title>Sleep Time Calculator</title>
<style>
*{margin:0;font-family:system-ui;box-sizing:border-box}
body{display:flex;justify-content:center;align-items:center;height:100vh;background:#111;color:#fff}
.container{text-align:center}
input[type=number],input[type=time]{font-size:2rem;text-align:center;background:#222;color:#fff;border:1px solid #444;border-radius:8px;padding:.3em .4em}
input[type=number]{width:6ch}
input[type=time]{width:8ch}
button{font-size:1.2rem;margin-left:.5em;padding:.4em 1em;background:#333;color:#fff;border:1px solid #444;border-radius:8px;cursor:pointer}
button:hover{background:#444}
p{margin-top:1em;font-size:3rem;font-variant-numeric:tabular-nums}
label{font-size:1rem;color:#888}
.section{margin-bottom:2em}
.divider{color:#444;margin:1.5em 0;font-size:0.9rem}
.row{display:flex;align-items:center;justify-content:center;gap:.5em;margin-top:.8em}
.toggle{display:inline-flex;border:1px solid #444;border-radius:8px;overflow:hidden;margin-left:0}
.toggle input{display:none}
.toggle label{padding:.4em .8em;font-size:1rem;color:#888;cursor:pointer;background:#222;transition:background .15s,color .15s}
.toggle input:checked+label{background:#555;color:#fff}
</style></head>
<body><div class="container">

<div class="section">
<form action="/" method=get>
<label>Minutes from 00:00</label>
<div class="row">
<input name=m type=number value="${minutesInput ?? ""}" autofocus>
<button>Go</button>
</div>
${time24 ? `<p>${time24}</p><p style="font-size:1.5rem;color:#888">${time12}</p>` : ""}
</form>
</div>

<div class="divider">— or —</div>

<div class="section">
<form action="/" method=get>
<label>Time to minutes</label>
<div class="row">
<input name=t type=time value="${timeInput ?? ""}" step="60">
<div class="toggle">
<input type=radio name=ampm value="am" id=am${ampm === "am" ? " checked" : ""}><label for=am>AM</label>
<input type=radio name=ampm value="pm" id=pm${ampm === "pm" ? " checked" : ""}><label for=pm>PM</label>
<input type=radio name=ampm value="" id=h24${!ampm ? " checked" : ""}><label for=h24>24h</label>
</div>
<button>Go</button>
</div>
${minutes != null ? `<p>${minutes}</p><p style="font-size:1.5rem;color:#888">minutes</p>` : ""}
</form>
</div>

</div></body></html>`;
}
