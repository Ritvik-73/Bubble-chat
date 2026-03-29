import { useState } from 'react'

const MessageInput = () => {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (!message.trim()) return
    console.log('Sending:', message)
    setMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-3 px-5  shrink-0" style={{ background: '#272724', borderTop: '0.5px solid #8f8e86', height: '57px'}}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 rounded-3xl px-4 py-2 text-sm outline-none"
        style={{ background: '#3e3e3b', border: '0.5px solid #8f8e86', color: '#b0aea5' }}
      />
      <button
        onClick={handleSend}
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-opacity hover:opacity-80"
        style={{ background: '#1D9E75' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  )
}

export default MessageInput