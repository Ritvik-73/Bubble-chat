const MessageBubble = ({ message, isOwn }) => {
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

  return (
    <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>

      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 mb-1"
        style={getAvatarStyle()}
      >
        {message.is_ai ? 'AI' : getInitials(message.sender_name)}
      </div>

      {/* Bubble + meta */}
      <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender name */}
        {!isOwn && (
          <span className="text-xs mb-1 px-1" style={{ color: message.is_ai ? '#a78bfa' : '#1D9E75' }}>
            {message.sender_name}
          </span>
        )}

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

        {/* Time */}
        <span className="text-xs mt-1 px-1" style={{ color: '#8f8e86' }}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

    </div>
  )
}

export default MessageBubble