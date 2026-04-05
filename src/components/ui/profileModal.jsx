import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const ProfileModal = ({ onClose }) => {
  const { user } = useAuth()
  const [username, setUsername] = useState(
    user?.user_metadata?.username || user?.email?.split('@')[0]
  )
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || null
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)

  const getInitials = (name) => name?.slice(0, 2).toUpperCase()

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('Avatars')
      .upload(filePath, file, { upsert: true })  

    if (uploadError) {
      console.error('Upload error:', uploadError)
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from('Avatars')
      .getPublicUrl(filePath)

    console.log('Avatar URL:', data.publicUrl)
    setAvatarUrl(data.publicUrl + '?t=' + new Date().getTime())
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)

    await supabase.auth.updateUser({
      data: { username, avatar_url: avatarUrl }
    })

    await supabase
      .from('profiles')
      .update({ username, avatar_url: avatarUrl })
      .eq('id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 flex flex-col gap-5 w-80"
        style={{ background: '#272724', border: '0.5px solid #8f8e86' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold" style={{ color: '#b0aea5' }}>Your profile</p>
          <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0aea5" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-3">
          <label className="cursor-pointer group relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white overflow-hidden"
              style={{ background: '#1D9E75' }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(username)
              )}
            </div>

            {/* Hover overlay */}
            <div
              className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(0,0,0,0.5)' }}
            >
              {uploading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
          <p className="text-xs" style={{ color: '#8f8e86' }}>Click to change photo</p>
        </div>

        {/* Username field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs" style={{ color: '#8f8e86' }}>USERNAME</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full text-sm rounded-lg px-3 py-2 outline-none"
            style={{ background: '#3e3e3b', border: '0.5px solid #8f8e86', color: '#b0aea5' }}
          />
        </div>

        {/* Account info */}
        <div
          className="rounded-lg px-3 py-3 flex flex-col gap-2"
          style={{ background: '#3e3e3b' }}
        >
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: '#8f8e86' }}>Email</span>
            <span className="text-xs" style={{ color: '#b0aea5' }}>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: '#8f8e86' }}>Joined</span>
            <span className="text-xs" style={{ color: '#b0aea5' }}>
              {new Date(user?.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: saved ? '#085041' : '#1D9E75', color: '#fff' }}
        >
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

export default ProfileModal