import { useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import useTyping from '../../hooks/useTyping'
import useMessages from '../../hooks/useMessages'
import MessageBubble from './MessageBubble'

const MessageList = ({ roomId, selectedUser }) => {
  const { user } = useAuth()
  const { messages, loading } = useMessages(roomId)
  const { typingUsers } = useTyping(roomId,user)
  const bottomRef = useRef(null)

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
      <div className="flex items-center justify-center">
        <span className="text-xs px-3 py-1 rounded-lg" style={{ background: '#3e3e3b', color: '#8f8e86' }}>
          Today
        </span>
      </div>

      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#3e3e3b' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8f8e86" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: '#b0aea5' }}>No messages yet</p>
          <p className="text-xs" style={{ color: '#8f8e86' }}>Be the first to say something 👋</p>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.sender_id === user?.id && !msg.is_ai}
        />
      ))}

      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#8f8e86', animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#8f8e86', animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: '#8f8e86', animationDelay: '300ms' }} />
          </div>
          <span className="text-xs" style={{ color: '#8f8e86' }}>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

export default MessageList