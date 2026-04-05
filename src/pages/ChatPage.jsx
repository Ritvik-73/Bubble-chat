import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/chat/sidebar'
import ChatHeader from '../components/chat/ChatHeader'
import MessageList from '../components/chat/MessageList'
import MessageInput from '../components/chat/MessageInput'
import { getPrivateRoomId, GENERAL_ROOM, AI_ROOM } from '../lib/rooms'
import { supabase } from '../lib/supabase'
import useNotifications from '../hooks/useNotifications'

const ChatPage = () => {
  const { user } = useAuth()
  const [selectedUser, setSelectedUser] = useState('general')
  const { requestPermission, sendNotification } = useNotifications()

  const getRoomId = () => {
    if (selectedUser === 'general') return GENERAL_ROOM
    if (selectedUser === 'ai') return AI_ROOM
    return getPrivateRoomId(user.id, selectedUser.id)
  }

  const roomId = getRoomId()

  // Request notification permission on load
  useEffect(() => {
    requestPermission()
  }, [])

  // Listen for ALL new messages and notify if from another room
  useEffect(() => {
    const channel = supabase
      .channel('global-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new

          if (msg.sender_id === user.id) return
          if (msg.is_ai) return

          // Get current room at time of message
          const currentRoomId = getRoomId()
          if (msg.room_id === currentRoomId) return

          sendNotification(
            `New message from ${msg.sender_name}`,
            msg.content.slice(0, 80)
          )
        }
      )
      .subscribe()

  return () => supabase.removeChannel(channel)
}, [selectedUser])

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: '#30302e' }}>
      <Sidebar
        onSelectUser={setSelectedUser}
        selectedUser={selectedUser}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatHeader selectedUser={selectedUser} />
        <MessageList roomId={roomId} selectedUser={selectedUser} />
        <MessageInput roomId={roomId} selectedUser={selectedUser} />
      </div>
    </div>
  )
}

export default ChatPage