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
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id))
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) => msg.id === payload.new.id ? payload.new : msg)
          )
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [roomId])

  const markAsSeen = async (roomId, userId) => {
    await supabase.rpc('mark_messages_seen', {
      room_id_input: roomId,
      user_id_input: userId
    })
  }

  return { messages, loading, markAsSeen }
}

export default useMessages