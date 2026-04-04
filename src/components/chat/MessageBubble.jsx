import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥']

const MessageBubble = ({ message, isOwn }) => {
  const [hovered, setHovered] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reactions, setReactions] = useState([])
  const [showReactions, setShowReactions] = useState(false)
  const { user } = useAuth()

  const getInitials = (name) => name?.slice(0, 2).toUpperCase()

  const getBubbleStyle = () => {
    if (message.is_ai) return { background: '#2e2a3e', color: '#c4b5fd' }
    if (isOwn) return { background: '#1D9E75', color: '#fff' }
    return { background: '#3e3e3b', color: '#b0aea5' }
  }

  const getAvatarStyle = () => {
    if (message.is_ai) return { background: '#4c1d95' }
    if (isOwn) return { background: '#1D9E75' }
    return { background: '#92400e' }
  }

  useEffect(() => {
    const fetchReactions = async () => {
      const { data } = await supabase
        .from('reactions')
        .select('*')
        .eq('message_id', message.id)
      if (data) setReactions(data)
    }

    fetchReactions()

    const channel = supabase
      .channel(`reactions-${message.id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'reactions',
          filter: `message_id=eq.${message.id}` },
        () => fetchReactions()
      )
      .on('postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'reactions' },
      () => fetchReactions()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [message.id])

  const handleReact = async (emoji) => {
    setShowReactions(false)

    const existingReaction = reactions.find(r => r.user_id === user.id)

    if (existingReaction) {
      await supabase.from('reactions').delete().eq('id', existingReaction.id)
      if (existingReaction.emoji !== emoji) {
        await supabase.from('reactions').insert({
          message_id: message.id,
          user_id: user.id,
          emoji
        })
      }
    } else {
      await supabase.from('reactions').insert({
        message_id: message.id,
        user_id: user.id,
        emoji
      })
    }
  }

  const groupedReactions = reactions.reduce((acc, r) => {
    acc[r.emoji] = acc[r.emoji] || { count: 0, reacted: false }
    acc[r.emoji].count++
    if (r.user_id === user.id) acc[r.emoji].reacted = true
    return acc
  }, {})

  const handleDelete = async () => {
    setShowConfirm(false)
    setDeleting(true)
    setTimeout(async () => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', message.id)
      if (error) {
        console.error('Delete error:', error)
        setDeleting(false)
      }
    }, 200)
  }

  return (
    <>
      {showConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="rounded-2xl p-6 flex flex-col gap-4 w-80"
            style={{ background: '#272724', border: '0.5px solid #8f8e86' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold" style={{ color: '#b0aea5' }}>Delete message?</p>
              <p className="text-xs" style={{ color: '#8f8e86' }}>This will be removed for everyone and cannot be undone.</p>
            </div>
            <div className="text-xs px-3 py-2 rounded-lg" style={{ background: '#3e3e3b', color: '#8f8e86' }}>
              "{message.content.slice(0, 60)}{message.content.length > 60 ? '...' : ''}"
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-lg text-xs font-medium hover:opacity-80"
                style={{ background: '#3e3e3b', color: '#b0aea5' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-lg text-xs font-medium hover:opacity-80"
                style={{ background: '#7f1d1d', color: '#fca5a5' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`message-animate ${deleting ? 'message-deleting' : ''} flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setShowReactions(false) }}
      >
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 mb-1"
          style={getAvatarStyle()}
        >
          {message.is_ai ? 'AI' : getInitials(message.sender_name)}
        </div>

        {/* Bubble + meta */}
        <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
          {!isOwn && (
            <span className="text-xs mb-1 px-1" style={{ color: message.is_ai ? '#a78bfa' : '#1D9E75' }}>
              {message.sender_name}
            </span>
          )}

          <div className={`flex items-center gap-2 relative ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>

            {/* Bubble */}
            <div
              className="px-3 py-2 text-sm leading-relaxed"
              style={{
                ...getBubbleStyle(),
                borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              }}
            >
              {message.content}
            </div>

            {/* Action buttons */}
            {hovered && (
              <div className="flex items-center gap-2 shrink-0 self-center">

                {/* React button */}
                <div className="relative">
                  <button
                    onClick={() => setShowReactions(prev => !prev)}
                    className="opacity-60 hover:opacity-100 transition-opacity flex items-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8f8e86" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                  </button>

                  {/* Quick emoji tray */}
                  {showReactions && (
                    <div
                      className="absolute bottom-6 flex gap-1 px-2 py-1 rounded-full z-10"
                      style={{
                        background: '#272724',
                        border: '0.5px solid #8f8e86',
                        left: isOwn ? 'auto' : '0',
                        right: isOwn ? '0' : 'auto'
                      }}
                    >
                      {QUICK_EMOJIS.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(emoji)}
                          className="text-sm hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delete button — own messages only */}
                {isOwn && !message.is_ai && (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="opacity-60 hover:opacity-100 transition-opacity flex items-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8f8e86" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Reactions display */}
          {Object.keys(groupedReactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 px-1">
              {Object.entries(groupedReactions).map(([emoji, { count, reacted }]) => (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all"
                  style={{
                    background: reacted ? 'rgba(29,158,117,0.2)' : '#3e3e3b',
                    border: reacted ? '0.5px solid #1D9E75' : '0.5px solid #8f8e86',
                    color: '#b0aea5'
                  }}
                >
                  {emoji} {count}
                </button>
              ))}
            </div>
          )}

          <span className="text-xs mt-1 px-1" style={{ color: '#8f8e86' }}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </>
  )
}

export default MessageBubble