import { supabase } from '../lib/supabase'

const ChatPage = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
      <p className="text-gray-400 text-sm">Chat coming Day 2 👋</p>
      <button
        onClick={handleLogout}
        className="text-sm text-red-400 hover:underline"
      >
        Log out
      </button>
    </div>
  )
}

export default ChatPage