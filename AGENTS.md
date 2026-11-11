# AGENTS.md

## Project

`clone-tabnews-ai` — a clone of [TabNews](https://www.tabnews.com.br) built with Next.js. The app is in early development; the home route lives in `app/page.tsx`.

## Stack

- Next.js (App Router)
- React
- TypeScript (strict mode)
- Plain CSS (`app/globals.css`); no CSS framework or component library

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # serve production build
npx tsc --noEmit # type-check
```

Check `package.json` for any lint, format, or test scripts before assuming one exists.

## Conventions

- Use the App Router: routes live in `app/` as `page.tsx`, `layout.tsx`, etc.
- Import project files with the `@/` alias.
- TypeScript strict mode is enabled; new code must be typed and pass `npx tsc --noEmit`.
- UI copy is in Portuguese (pt-BR); keep metadata and user-facing text consistent with that.
- Prefer server components; add `"use client"` only when a component needs browser state or effects.
- No comments in code unless necessary.

## Notes for agents

- Do not commit unless explicitly asked.
- `.env*` files are gitignored; never hardcode secrets.
- Keep changes minimal; avoid introducing new dependencies without need.
