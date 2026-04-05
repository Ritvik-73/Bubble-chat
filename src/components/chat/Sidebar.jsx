import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import useProfiles from '../../hooks/useProfiles'
import ProfileModal from '../ui/profileModal'

const Sidebar = ({ onSelectUser, selectedUser }) => {
  const { user } = useAuth()
  const { profiles, isOnline } = useProfiles()
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }
  
  const getInitials = (name) => name?.slice(0, 2).toUpperCase()
  
  const avatarColors = [
    '#1D9E75', '#92400e', '#1e3a5f', '#4c1d95',
    '#831843', '#065f46', '#1e40af', '#92400e'
  ]
  
  const getAvatarColor = (id) => {
    const index = id?.charCodeAt(0) % avatarColors.length
    return avatarColors[index] || '#1D9E75'
  }
  
  // Filter out current user from list
  const otherProfiles = profiles.filter(p => p.id !== user?.id)
  
  
  const [ showProfile, setShowProfile ] = useState(false)
  
  return (
    <div className="flex flex-col h-full w-1/3" style={{ background: '#30302e', borderRight: '0.5px solid #8f8e86' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 shrink-0" style={{ background: '#272724', borderBottom: '0.5px solid #8f8e86', height: '57px' }}>
        <span className="font-semibold text-sm" style={{ color: '#b0aea5' }}>
          Bubble<span style={{ color: '#1D9E75' }}>Chat</span>
        </span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: '#1D9E75' }}>
          {getInitials(user?.user_metadata?.username || user?.email)}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3" style={{ borderBottom: '0.5px solid #8f8e86' }}>
        <input
          type="text"
          placeholder="Search or start new chat"
          className="w-full text-xs rounded-lg px-3 py-2 outline-none"
          style={{ background: '#272724', border: '0.5px solid #8f8e86', color: '#b0aea5' }}
          />
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto">

        {/* AI Contact */}
        <p className="px-5 pt-3 pb-1 text-xs tracking-widest" style={{ color: '#8f8e86' }}>DIRECT MESSAGES</p>

        <div
          onClick={() => onSelectUser('ai')}
          className="flex items-center gap-3 px-5 py-3 cursor-pointer"
          style={{
            borderBottom: '0.5px solid #3e3e3b',
            background: selectedUser === 'ai' ? 'rgba(29,158,117,0.12)' : 'transparent'
          }}
          >
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: '#4c1d95' }}>
              AI
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: '#1D9E75', borderColor: '#30302e' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: '#b0aea5' }}>Bubble AI</p>
            <p className="text-xs" style={{ color: '#8f8e86' }}>Ask me anything...</p>
          </div>
        </div>

        {/* Real users */}
        {otherProfiles.map((profile) => (
          <div
          key={profile.id}
          onClick={() => onSelectUser(profile)}
          className="flex items-center gap-3 px-5 py-3 cursor-pointer"
          style={{
            borderBottom: '0.5px solid #3e3e3b',
            background: selectedUser?.id === profile.id ? 'rgba(29,158,117,0.12)' : 'transparent'
          }}
          >
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                style={{ background: getAvatarColor(profile.id) }}
                >
                {getInitials(profile.username)}
              </div>
              {isOnline(profile.last_seen) && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: '#1D9E75', borderColor: '#30302e' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#b0aea5' }}>{profile.username}</p>
              <p className="text-xs" style={{ color: isOnline(profile.last_seen) ? '#1D9E75' : '#8f8e86' }}>
                {isOnline(profile.last_seen) ? 'online' : 'offline'}
              </p>
            </div>
          </div>
        ))}

        {/* Group Chat */}
        <p className="px-5 pt-3 pb-1 text-xs tracking-widest" style={{ color: '#8f8e86' }}>GROUP CHAT</p>

        <div
          onClick={() => onSelectUser('general')}
          className="flex items-center gap-3 px-5 py-3 cursor-pointer"
          style={{
            borderBottom: '0.5px solid #3e3e3b',
            background: selectedUser === 'general' ? 'rgba(29,158,117,0.12)' : 'transparent'
          }}
          >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: '#272724', border: '0.5px solid #1D9E75' }}>
            GC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: '#b0aea5' }}>General</p>
            <p className="text-xs" style={{ color: '#8f8e86' }}>Everyone is here</p>
          </div>
        </div>
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      </div>

      {/* Bottom user card */}
      <div className="px-4 py-3 shrink-0" style={{ borderTop: '0.5px solid #8f8e86' }}>
        <div
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-all"
          style={{ background: '#272724', height: '41px' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#3e3e3b'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#272724'}
        >
          <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden" style={{ background: '#1D9E75' }}>
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-white">
                {getInitials(user?.user_metadata?.username || user?.email)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: '#b0aea5' }}>
              {user?.user_metadata?.username || user?.email.split('@')[0]}
            </p>
            <p className="text-xs truncate" style={{ color: '#8f8e86' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-xs text-[#8f8e86] hover:text-red-400 transition-colors shrink-0" >
            Sign out
          </button>
        </div>
      </div>

    </div>
  )
}

export default Sidebar