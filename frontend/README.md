# Character Chat Frontend

Minimal Vite + React UI for chatting with the two character prompts defined in the backend.

## Setup

1. Install dependencies in this folder.
2. Make sure the backend is running on `http://localhost:3000` or set `VITE_API_BASE_URL` to your backend URL.
3. Start the frontend with Vite.

```bash
npm install
npm run dev
```

If your backend is on a different host or port, create a local `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

## Run

- Frontend: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Backend Contract

The UI sends a `POST /chat` request with:

```json
{
  "characterPrompt": "...",
  "userPrompt": "..."
}
```

The frontend keeps a separate conversation thread for each character and sends a compact transcript of the latest turns as part of `userPrompt` so the backend can stay context-aware without extra API complexity.

## Character Data

The character data was prepared manually from public-facing teaching content, interviews, livestreams, and long-form tutorials for each creator. The prompts were then condensed into a style guide that captures:

- speaking style and language mix
- teaching approach and explanation depth
- repeated phrases and humor boundaries
- subject-matter focus and preferred examples

The goal is consistency, not imitation of a specific transcript.

## Prompt Engineering Strategy

Each character prompt acts as a system instruction and defines:

- tone and vocabulary
- teaching style and response structure
- when to ask follow-up questions
- how much detail to give based on user skill level

The user message is kept separate and the frontend adds only a short transcript of recent turns. That keeps the prompt stable and reduces drift across longer chats.

## Context Management

The app stores one conversation per character in browser state. On each send, it includes only the most recent turns in the request payload, which keeps requests small and helps the model stay on topic. This approach is simple, easy to debug, and works well for a minimal project.

## Sample Conversations

Hitesh character:

- User: Explain closures in simple Hinglish.
- Assistant: Uses a grounded Hinglish explanation, short chunks, and a practical example.

Piyush character:

- User: What is the difference between API and backend?
- Assistant: Gives a step-by-step answer with an everyday analogy and a clear takeaway.

## Notes

- The design intentionally avoids purple and keeps the interface neutral, warm, and clean.
- The UI is intentionally minimal so character quality and conversation flow stay the focus.
