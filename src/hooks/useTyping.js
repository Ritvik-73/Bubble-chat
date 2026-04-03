import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const useTyping = (roomId, user) => {
  const [typingUsers, setTypingUsers] = useState([])
  const channelRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!user?.id || !roomId) return

    const channel = supabase.channel(`typing-${roomId}`)

    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        console.log('typing recieved:', payload)
        if (payload.payload.userId === user.id) return

        setTypingUsers(prev => {
          const exists = prev.find(u => u.userId === payload.payload.userId)
          if (exists) return prev
          return [...prev, payload.payload]
        })

        // Remove after 2.5 seconds of no updates
        setTimeout(() => {
          setTypingUsers(prev =>
            prev.filter(u => u.userId !== payload.payload.userId)
          )
        }, 2500)
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, user?.id])

  const sendTyping = useCallback(async () => {
    if (!channelRef.current || !user?.id) return
    console.log('sending typing')

    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        userId: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0]
      }
    })
  }, [user])

  return {
    typingUsers: typingUsers.map(u => u.username),
    sendTyping
  }
}

export default useTyping