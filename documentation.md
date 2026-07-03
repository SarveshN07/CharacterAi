# CharacterAI — Persona Development Documentation

---

## 1. How Persona Data Was Collected and Prepared

Data was gathered from three sources:

- **YouTube Transcripts** — Watched videos from both creators to understand how they talk, explain things, and wrap up. Picked up their language patterns and teaching style.
- **YouTube Comments** — Read through comments to see how the community talks about them and what phrases keep coming up.
- **Personal Observations** — I personally watched their content and noted things like when they use humor, how they handle beginners, and their personal branding (Hitesh's "chai" motif, Piyush's "Trust me, I'm a software engineer").
- **Help from Other Prompts** — Looked at some existing AI persona prompts online to get ideas on how to structure the instructions and looked at other student's prompt as well.

---

## 2. Prompt Engineering Strategy

I wrote a set of instructions for each persona and passed them to the AI before every chat. The idea was simple — tell the AI exactly who it is, how it talks, and how it should answer.

For each persona, the instructions covered:

- **Who they are** — their background, what they've built, where they teach
- **How they speak** — Hinglish style, informal tone, when to be funny
- **Phrases they use** — a list of real phrases I picked up from their videos (e.g. "Hanji", "Khair...", "Samjha?")
- **How they explain things** — start with the big picture, then go step by step, use simple analogies
- **How to wrap up** — always end with a question or something for the user to try

Nothing fancy — just writing down what I noticed and giving it to the AI in plain language.

---

## 3. Context Management Approach

```
Browser → POST /chat { characterPrompt, userPrompt } → Express → Gemini API
```

- The full persona instructions are sent to the AI on every message — so it never forgets who it's supposed to be.
- Only the current message is sent; no chat history goes to the backend.
- The frontend keeps separate chat lists for Hitesh and Piyush — switching between them doesn't wipe either conversation.
- Everything is in browser memory only — refreshing the page clears the chat.

---

## 4. Sample Conversations

### Hitesh Choudhary

**User:** What is an API?

**Hitesh:**

Hanji! Chai leke baitho.

API ka simple idea — socho ek waiter. Tum kitchen mein nahi jaate, tum waiter ko order karte ho. Waiter kitchen se khaana laata hai. Waiter = API.

Swiggy pe order karo → Swiggy restaurant ke API ko ping karta hai → restaurant confirm karta hai → tumhe update milta hai.

Samjha? Ab batao — koi project chal raha hai ya sirf basics clear karne hain?

---

### Piyush Garg

**User:** Bhai SQL aur NoSQL mein kya farak hai?

**Piyush:**

Toh chalo simple mein samajhte hain! Trust me, I'm a software engineer 😄

SQL = Excel sheet. Fixed rows, fixed columns. Relations ke liye best.
NoSQL = Sticky notes ka folder. Flexible structure, fast prototyping ke liye.

- Relations important hain → SQL
- Flexible data chahiye → NoSQL
- Confused? → SQL se start karo

Try karo ek chota project dono ke saath — phir batana kaisa gaya!

