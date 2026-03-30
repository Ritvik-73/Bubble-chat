import { use, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const useMessages = () => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        //fetch existing messages
        const fetchMessages = async () => {
            const {data, error} = await supabase
                .from('messages')
                .select('*')
                .order('created_at', {ascending: true})
                .limit(50)

            if(error) console.error('Error fetching messages:', error)
            else setMessages(data)
            setLoading(false)
        }

        fetchMessages()

        //Subscribe to new messages in real time
        const channel = supabase
            .channel('messages-channel')
            .on(
                'postgres_changes',
                {event:'INSERT', schema: 'public', table: 'messages'},
                (payload) => {
                    setMessages((prev) => [...prev, payload.new])
                }
            )
            .subscribe()

        return () =>supabase.removeChannel(channel)
    }, [])

    return{ messages, loading }
}

export default useMessages