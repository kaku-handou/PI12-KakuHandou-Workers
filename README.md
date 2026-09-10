# PI12-KakuHandou-Workers

Cloudflare Pages と Workers を使った API 接続確認用のサンプルです。

## 構成

- `pages/index.html`: Worker のベース URL を指定して API を確認する静的画面
- `worker/src/index.js`: `/api/course`、`/api/hello`、`/api/fortune`、`/api/events`
- `worker/wrangler.toml`: Worker 名とデプロイ設定

## ローカル確認

```powershell
Set-Location .\worker
npm install
npm run dev
```

Pages は `pages/index.html` をブラウザで開き、ベース URL に `https://workers-backend.handongguo01.workers.dev` が設定された状態で「全エンドポイントを確認」を押します。ローカル Worker を確認する場合だけ `http://127.0.0.1:8787` に変更してください。

## デプロイ

```powershell
Set-Location .\worker
npm run deploy
```

本番 Worker URL: `https://workers-backend.handongguo01.workers.dev`

本番 Pages の URL が決まったら、`worker/wrangler.toml` の `ALLOWED_ORIGIN` をその Pages URL に変更してから再デプロイしてください。

## 動作確認

- `GET /api/course`、`/api/fortune`、`/api/events`: `200`
- `GET /api/hello?name=山田`: `200`
- `GET /api/hello?name=`: `400`
- 未定義パス: `404`
