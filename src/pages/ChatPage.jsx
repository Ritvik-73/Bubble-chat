import Sidebar from '../components/chat/sidebar'
import MessageList from '../components/chat/MessageList'
import MessageInput from '../components/chat/MessageInput'
import ChatHeader from '../components/chat/ChatHeader'


const ChatPage = () => {
  return (
    <div className="h-screen flex overflow-hidden" style={{ background: '#30302e' }}>

      {/* Left — Sidebar */}
      <Sidebar />

      {/* Right — Chat area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatHeader />
        <MessageList />
        <MessageInput />
      </div>

    </div>
  )
}

export default ChatPage