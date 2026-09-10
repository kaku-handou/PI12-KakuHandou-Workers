const course = {
  id: "PI12",
  title: "Cloudflare Workers API",
  description: "Pages から呼び出せるサンプル API",
  endpoints: ["/api/course", "/api/hello", "/api/fortune", "/api/events"]
};

const fortunes = [
  { rank: "大吉", message: "小さな一歩が、次の流れをつくります。" },
  { rank: "中吉", message: "誰かに相談すると、視界がひらけます。" },
  { rank: "吉", message: "整える時間が、良い結果を連れてきます。" }
];

function headers(request, env) {
  const configuredOrigin = env.ALLOWED_ORIGIN || "*";
  const requestOrigin = request.headers.get("Origin");
  const allowOrigin = configuredOrigin === "*" || configuredOrigin === requestOrigin ? configuredOrigin : "null";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };
}

function json(request, env, body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: headers(request, env) });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: headers(request, env) });
    if (request.method !== "GET") return json(request, env, { error: "Method Not Allowed" }, 405);

    try {
      if (url.pathname === "/api" || url.pathname === "/api/") {
        return json(request, env, { ok: true, service: "kaku-handou-api", endpoints: course.endpoints });
      }
      if (url.pathname === "/api/course") return json(request, env, course);
      if (url.pathname === "/api/hello") {
        const name = url.searchParams.get("name")?.trim();
        if (!name) return json(request, env, { error: "name は必須です" }, 400);
        return json(request, env, { message: `${name}さん、こんにちは！`, name });
      }
      if (url.pathname === "/api/fortune") {
        return json(request, env, { ...fortunes[Math.floor(Math.random() * fortunes.length)], date: new Date().toISOString().slice(0, 10) });
      }
      if (url.pathname === "/api/events") {
        return json(request, env, {
          events: [
            { date: "2026-09-12", title: "Workers API ハンズオン", place: "オンライン" },
            { date: "2026-09-19", title: "Pages 公開確認会", place: "Cloudflare Pages" }
          ]
        });
      }
      return json(request, env, { error: "Not Found" }, 404);
    } catch {
      return json(request, env, { error: "サーバーでエラーが発生しました" }, 500);
    }
  }
};