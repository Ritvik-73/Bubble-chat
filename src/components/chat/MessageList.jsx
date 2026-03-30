import { useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import useMessages from '../../hooks/useMessages'
import MessageBubble from './MessageBubble'

const MessageList = () => {
  const { user } = useAuth()
  const { messages, loading } = useMessages()
  const bottomRef = useRef(null)

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: '#30302e' }}>
        <p className="text-sm" style={{ color: '#8f8e86' }}>Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-5 py-4" style={{ background: '#30302e' }}>

      {/* Date divider */}
      <div className="flex items-center justify-center">
        <span className="text-xs px-3 py-1 rounded-lg" style={{ background: '#3e3e3b', color: '#8f8e86' }}>
          Today
        </span>
      </div>

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm" style={{ color: '#8f8e86' }}>No messages yet. Say hello! 👋</p>
        </div>
      )}

      {/* Real messages */}
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.sender_id === user?.id}
        />
      ))}

      {/* Invisible div at bottom for auto scroll */}
      <div ref={bottomRef} />

    </div>
  )
}

export default MessageList