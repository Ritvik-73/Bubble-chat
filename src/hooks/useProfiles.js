import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const useProfiles = () => {
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    // Fetch all profiles
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_seen', { ascending: false })

      if (error) console.error('Error fetching profiles:', error)
      else setProfiles(data)
    }

    fetchProfiles()

    // Listen for profile updates in realtime
    const channel = supabase
      .channel('profiles-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchProfiles()
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // Consider online if last_seen within 5 minutes
  const isOnline = (last_seen) => {
    const diff = new Date() - new Date(last_seen)
    return diff < 5 * 60 * 1000
  }

  return { profiles, isOnline }
}

export default useProfiles