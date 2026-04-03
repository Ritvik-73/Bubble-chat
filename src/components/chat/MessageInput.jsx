import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { askGemini } from '../../lib/gemini'
import useTyping from '../../hooks/useTyping'


const MessageInput = ({ roomId, selectedUser }) => {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const { user } = useAuth()
  const { sendTyping } = useTyping(roomId, user)

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
      const prompt = selectedUser === 'ai'
        ? message.trim()
        : message.slice(3).trim()
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

  const handleChange = (e) => {
    setMessage(e.target.value)
    sendTyping()
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
      className="flex items-center gap-3 px-5 shrink-0"
      style={{ background: '#272724', borderTop: '0.5px solid #8f8e86', height: '57px' }}
    >
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