'use client'

import { FormEvent, useState } from 'react'
import { PenLine } from 'lucide-react'

export function PromiseComposer({ onCreate }: { onCreate: (title: string) => void }) {
  const [title, setTitle] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onCreate(title)
    setTitle('')
  }

  return (
    <form className="promise-composer" onSubmit={handleSubmit}>
      <label htmlFor="promise-title">Promise line</label>
      <div>
        <input
          id="promise-title"
          maxLength={92}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="State one clear commitment"
          value={title}
        />
        <button type="submit" aria-label="Create promise">
          <PenLine size={17} aria-hidden="true" />
          Create
        </button>
      </div>
      <p>One wallet, one active promise.</p>
    </form>
  )
}
