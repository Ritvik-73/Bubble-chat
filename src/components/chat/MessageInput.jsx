import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { askGemini } from '../../lib/gemini'
import useTyping from '../../hooks/useTyping'
import EmojiPicker from 'emoji-picker-react'

const MessageInput = ({ roomId, selectedUser }) => {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const { user } = useAuth()
  const { sendTyping } = useTyping(roomId, user)
  const emojiRef = useRef(null)

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e) => {
    setMessage(e.target.value)
    sendTyping()
  }

  const handleEmojiClick = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji)
    setShowEmoji(false)
  }

  const handleSend = async () => {
    if (!message.trim()) return
    setSending(true)

    const isAiTrigger = message.toLowerCase().startsWith('@ai') || selectedUser === 'ai'

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        sender_name: user.user_metadata?.username || user.email,
        content: message.trim(),
        is_ai: false,
        room_id: roomId
      })

    if (error) {
      console.error('Error sending message:', error)
      setSending(false)
      return
    }

    setMessage('')

    if (isAiTrigger) {
      const prompt = selectedUser === 'ai' ? message.trim() : message.slice(3).trim()
      const aiReply = await askGemini(prompt)

      await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          sender_name: 'Bubble AI',
          content: aiReply,
          is_ai: true,
          room_id: roomId
        })
    }

    setSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getPlaceholder = () => {
    if (selectedUser === 'ai') return 'Ask Bubble AI anything...'
    if (selectedUser === 'general') return 'Message #general... or @ai to ask AI'
    return `Message ${selectedUser?.username || 'user'}... or @ai to ask AI`
  }

  return (
    <div
      className="flex items-center gap-3 px-5 shrink-0 relative"
      style={{ background: '#272724', borderTop: '0.5px solid #8f8e86', height: '57px' }}
    >
      {/* Emoji picker */}
      {showEmoji && (
        <div
          ref={emojiRef}
          className="absolute bottom-16 left-4 z-50"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="dark"
            skinTonesDisabled
            searchDisabled={false}
            width={300}
            height={380}
          />
        </div>
      )}

      {/* Emoji button */}
      <button
        onClick={() => setShowEmoji(prev => !prev)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b0aea5" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      </button>

      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder()}
        disabled={sending}
        className="flex-1 rounded-3xl px-4 py-2 text-sm outline-none"
        style={{ background: '#3e3e3b', border: '0.5px solid #8f8e86', color: '#b0aea5' }}
      />

      <button
        onClick={handleSend}
        disabled={sending || !message.trim()}
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-opacity hover:opacity-80 disabled:opacity-40"
        style={{ background: '#1D9E75' }}
      >
        {sending ? (
          <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        )}
      </button>
    </div>
  )
}

export default MessageInput