import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const MessageBubble = ({ message, isOwn }) => {
  const [hovered, setHovered] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
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
      {/* Confirmation modal */}
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
              <p className="text-xs" style={{ color: '#8f8e86' }}>This will be removed for everyone. This action cannot be undone.</p>
            </div>

            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: '#3e3e3b', color: '#8f8e86' }}
            >
              "{message.content.slice(0, 60)}{message.content.length > 60 ? '...' : ''}"
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                style={{ background: '#3e3e3b', color: '#b0aea5' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                style={{ background: '#7f1d1d', color: '#fca5a5' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`message-animate flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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

          <div className={`message-animate ${deleting ? 'message-deleting' : ''} flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
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

            {/* Delete button */}
            {isOwn && hovered && !message.is_ai && (
              <button
                onClick={() => setShowConfirm(true)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity self-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8f8e86" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                </svg>
              </button>
            )}
          </div>

          <span className="text-xs mt-1 px-1" style={{ color: '#8f8e86' }}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </>
  )
}

export default MessageBubble