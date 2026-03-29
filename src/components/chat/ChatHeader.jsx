const ChatHeader = () => {
  return (
    <div className="flex items-center gap-3 px-5 shrink-0" style={{ background: '#272724', borderBottom: '0.5px solid #8f8e86', height: '57px' }}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: '#4c1d95' }}>
        AI
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: '#b0aea5' }}>Bubble AI</p>
        <p className="text-xs" style={{ color: '#1D9E75' }}>online</p>
      </div>
    </div>
  )
}

export default ChatHeader