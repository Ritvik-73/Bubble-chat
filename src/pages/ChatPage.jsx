import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/chat/Sidebar'
import ChatHeader from '../components/chat/ChatHeader'
import MessageList from '../components/chat/MessageList'
import MessageInput from '../components/chat/MessageInput'
import { getPrivateRoomId, GENERAL_ROOM, AI_ROOM } from '../lib/rooms'

const ChatPage = () => {
  const { user } = useAuth()
  const [selectedUser, setSelectedUser] = useState('general')

  const getRoomId = () => {
    if (selectedUser === 'general') return GENERAL_ROOM
    if (selectedUser === 'ai') return AI_ROOM
    return getPrivateRoomId(user.id, selectedUser.id)
  }

  const roomId = getRoomId()

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