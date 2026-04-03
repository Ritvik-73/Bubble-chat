import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const useMessages = (roomId = 'general') => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMessages([])
    setLoading(true)

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(50)

      if (error) console.error('Error fetching messages:', error)
      else setMessages(data)
      setLoading(false)
    }

    fetchMessages()

    const channel = supabase
      .channel(`messages-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [roomId])

  return { messages, loading }
}

export default useMessages