const useNotifications = () => {
  const requestPermission = async () => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const sendNotification = (title, body, icon = '/vite.svg') => {
    if (Notification.permission !== 'granted') return

    new Notification(title, {
      body,
      icon,
      badge: '/vite.svg',
      silent: false
    })
  }

  return { requestPermission, sendNotification }
}

export default useNotifications