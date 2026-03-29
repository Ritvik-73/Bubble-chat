import MessageBubble from './MessageBubble'
import { useAuth } from '../../context/AuthContext'

const dummyMessages = [
  { id: 1, sender_name: 'Bubble AI', content: 'Hey! I am Bubble AI. Ask me anything and I will help you out.', is_ai: true, created_at: '10:01' },
  { id: 2, sender_name: 'Kivtir73', content: 'What is the weather like on Mars?', is_ai: false, sender_id: 'me', created_at: '10:02' },
  { id: 3, sender_name: 'Bubble AI', content: 'Mars averages −60°C, with thin CO₂ atmosphere and frequent dust storms. Not great for a picnic!', is_ai: true, created_at: '10:02' },
  { id: 4, sender_name: 'Alex', content: 'Haha that is wild 😄', is_ai: false, sender_id: 'other', created_at: '10:03' },
  { id: 5, sender_name: 'Kivtir73', content: 'Right?! 😂', is_ai: false, sender_id: 'me', created_at: '10:03' },
]

const MessageList = () => {
  const { user } = useAuth()

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-3 px-5 py-4" style={{ background: '#30302e' }}>

      {/* Date divider */}
      <div className="flex items-center justify-center">
        <span className="text-xs px-3 py-1 rounded-lg" style={{ background: '#3e3e3b', color: '#8f8e86' }}>
          Today
        </span>
      </div>

      {dummyMessages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isOwn={msg.sender_id === 'me'}
        />
      ))}

    </div>
  )
}

export default MessageList