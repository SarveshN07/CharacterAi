import { type FormEvent, useEffect, useRef, useState } from 'react'
import './App.css'
import { characterPrompts } from './character'

type CharacterKey = keyof typeof characterPrompts

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function renderInlineBold(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    const isBold = /^\*\*.*\*\*$/.test(part)
    if (!isBold) {
      return part
    }

    return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>
  })
}

function renderFormattedContent(content: string) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks.map((block, index) => {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length === 1 && /^###\s+/.test(lines[0])) {
      return (
        <h3 key={`${index}-${block.slice(0, 10)}`} className="formatted-title">
          {renderInlineBold(lines[0].replace(/^###\s+/, ''))}
        </h3>
      )
    }

    if (lines.length > 0 && lines.every((line) => /^[-*•]\s+/.test(line))) {
      return (
        <ul key={`${index}-${block.slice(0, 10)}`}>
          {lines.map((line, lineIndex) => (
            <li key={`${index}-${lineIndex}`}>{renderInlineBold(line.replace(/^[-*•]\s+/, ''))}</li>
          ))}
        </ul>
      )
    }

    if (lines.length > 0 && lines.every((line) => /^\d+\.\s+/.test(line))) {
      return (
        <ol key={`${index}-${block.slice(0, 10)}`}>
          {lines.map((line, lineIndex) => (
            <li key={`${index}-${lineIndex}`}>{renderInlineBold(line.replace(/^\d+\.\s+/, ''))}</li>
          ))}
        </ol>
      )
    }

    return (
      <p key={`${index}-${block.slice(0, 10)}`} className="formatted-paragraph">
        {renderInlineBold(block)}
      </p>
    )
  })
}

function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterKey>('hitesh')
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const [conversations, setConversations] = useState<Record<CharacterKey, Message[]>>({
    hitesh: [],
    piyush: [],
  })

  const listEndRef = useRef<HTMLDivElement | null>(null)

  const activeConversation = conversations[selectedCharacter]
  const activeCharacterName = selectedCharacter === 'hitesh' ? 'Hitesh Choudhary' : 'Piyush Garg'
  const activeAccent = selectedCharacter === 'hitesh' ? 'amber' : 'teal'

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation, selectedCharacter])

  async function sendMessage(messageText: string) {
    const trimmedText = messageText.trim()
    if (!trimmedText || isSending) {
      return
    }

    const userMessage: Message = {
      id: createId(),
      role: 'user',
      content: trimmedText,
    }

    const currentCharacter = selectedCharacter
    setDraft('')
    setError('')
    setIsSending(true)
    setConversations((previous) => ({
      ...previous,
      [currentCharacter]: [...previous[currentCharacter], userMessage],
    }))

    try {
      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterPrompt: characterPrompts[currentCharacter],
          userPrompt: trimmedText,
        }),
      })

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`)
      }

      const data = (await response.json()) as { content?: string }
      const assistantMessage: Message = {
        id: createId(),
        role: 'assistant',
        content: data.content?.trim() || 'No response received from the backend.',
      }

      setConversations((previous) => ({
        ...previous,
        [currentCharacter]: [...previous[currentCharacter], assistantMessage],
      }))
    } catch {
      setError('Could not reach the backend. Make sure the server is running.')
      setConversations((previous) => ({
        ...previous,
        [currentCharacter]: [
          ...previous[currentCharacter],
          {
            id: createId(),
            role: 'assistant',
            content: `I could not reach the backend. Check that it is running at ${apiBaseUrl}.`,
          },
        ],
      }))
    } finally {
      setIsSending(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage(draft)
  }

  return (
    <main className={`app-shell theme-${activeAccent}`}>
      <header className="topbar">
        <h1>CharacterAi</h1>
        <div className="character-switch" role="tablist" aria-label="Character selector">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCharacter === 'hitesh'}
            className={`character-chip ${selectedCharacter === 'hitesh' ? 'active' : ''}`}
            onClick={() => setSelectedCharacter('hitesh')}
          >
            Hitesh
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedCharacter === 'piyush'}
            className={`character-chip ${selectedCharacter === 'piyush' ? 'active' : ''}`}
            onClick={() => setSelectedCharacter('piyush')}
          >
            Piyush
          </button>
        </div>
      </header>

      <section className="chat-panel" aria-label="Chat panel">
        <div className="chat-header">
          <h2>{activeCharacterName}</h2>
          <span className="status-pill">{activeConversation.length} turns</span>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="message-list" aria-live="polite">
          {activeConversation.length === 0 ? <div className="empty-state">Start the conversation...</div> : null}

          {activeConversation.map((message) => (
            <article key={message.id} className={`message ${message.role}`}>
              <span className="message-role">{message.role === 'user' ? 'You' : activeCharacterName}</span>
              <div className="message-content">{renderFormattedContent(message.content)}</div>
            </article>
          ))}
          <div ref={listEndRef} />
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask your question..."
            rows={4}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void sendMessage(draft)
              }
            }}
          />

          <button type="submit" className="send-button" disabled={isSending || !draft.trim()}>
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default App