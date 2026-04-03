import useProfiles from '../../hooks/useProfiles'

const ChatHeader = ({ selectedUser }) => {
  const { isOnline } = useProfiles()

  const getName = () => {
    if (selectedUser === 'ai') return 'Bubble AI'
    if (selectedUser === 'general') return '# General'
    return selectedUser?.username || 'Unknown'
  }

  const getInitials = () => {
    if (selectedUser === 'ai') return 'AI'
    if (selectedUser === 'general') return 'GC'
    return selectedUser?.username?.slice(0, 2).toUpperCase()
  }

  const getAvatarColor = () => {
    if (selectedUser === 'ai') return '#4c1d95'
    if (selectedUser === 'general') return '#272724'
    return '#1D9E75'
  }

  const getStatus = () => {
    if (selectedUser === 'ai') return 'online'
    if (selectedUser === 'general') return 'group chat'
    return isOnline(selectedUser?.last_seen) ? 'online' : 'offline'
  }

  const getStatusColor = () => {
    if (selectedUser === 'ai') return '#1D9E75'
    if (selectedUser === 'general') return '#1D9E75'
    return isOnline(selectedUser?.last_seen) ? '#1D9E75' : '#8f8e86'
  }

  return (
    <div
      className="flex items-center gap-3 px-5 shrink-0"
      style={{ background: '#272724', borderBottom: '0.5px solid #8f8e86', height: '57px' }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
        style={{ background: getAvatarColor(), border: selectedUser === 'general' ? '0.5px solid #1D9E75' : 'none' }}
      >
        {getInitials()}
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: '#b0aea5' }}>{getName()}</p>
        <p className="text-xs" style={{ color: getStatusColor() }}>{getStatus()}</p>
      </div>
    </div>
  )
}

export default ChatHeader