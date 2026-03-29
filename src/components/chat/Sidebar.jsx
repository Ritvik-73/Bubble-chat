import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const Sidebar = () => {
  const { user } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // Get initials from email
  const getInitials = (email) => {
    return email?.slice(0, 2).toUpperCase()
  }

  return (
    <div className="flex flex-col h-full w-1/3 overflow-y-auto" style={{ background: '#30302e', borderRight: '0.5px solid #8f8e86' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 " style={{ background: '#272724', borderBottom: '0.5px solid #8f8e86', height: '57px' }}>
        <span className="font-bold text-lg" style={{ color: '#b0aea5' }}>
          Bubble<span style={{ color: '#1D9E75' }}>Chat</span>
        </span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: '#1D9E75' }}>
          {getInitials(user?.email)}
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

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">

        {/* Section label */}
        <p className="px-5 pt-3 pb-1 text-xs tracking-widest" style={{ color: '#8f8e86' }}>DIRECT MESSAGES</p>

        {/* AI Contact */}
        <div className="flex items-center gap-3 px-5 py-3 cursor-pointer" style={{ borderBottom: '0.5px solid #3e3e3b', background: 'rgba(29,158,117,0.12)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0" style={{ background: '#4c1d95' }}>
            AI
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: '#b0aea5' }}>Bubble AI</p>
            <p className="text-xs truncate" style={{ color: '#8f8e86' }}>Ask me anything...</p>
          </div>
          <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs text-white shrink-0" style={{ background: '#1D9E75', fontSize: '10px' }}>2</div>
        </div>

        {/* Section label */}
        <p className="px-5 pt-3 pb-1 text-xs tracking-widest" style={{ color: '#8f8e86' }}>GROUP CHAT</p>

        {/* General room */}
        <div className="flex items-center gap-3 px-5 py-3 cursor-pointer" style={{ borderBottom: '0.5px solid #3e3e3b' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: '#272724', border: '0.5px solid #1D9E75' }}>
            GC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium" style={{ color: '#b0aea5' }}>General</p>
            <p className="text-xs truncate" style={{ color: '#8f8e86' }}>Everyone is here</p>
          </div>
        </div>

      </div>

      {/* Bottom — logged in user */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ background: '#272724' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: '#1D9E75' }}>
            {getInitials(user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: '#b0aea5' }}>
              {user?.user_metadata?.username || user?.email}
            </p>
            <p className="text-xs truncate" style={{ color: '#8f8e86' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-xs hover:text-rose-500 transition-colors shrink-0 text-[#b0aea5]">
            Sign out
          </button>
        </div>
      </div>

    </div>
  )
}

export default Sidebar