import { reactive } from 'vue'

type notification = {
  id: string
  message: string
  timeout?: number
}

const notifications = reactive<notification[]>([])

const addNotification = ({ message, timeout }: notification) => {
  console.log('addNotification', message)
  const id = `${Math.random()}${Date.now()}`
  notifications.push({
    id,
    message
  })
  if (timeout) {
    setTimeout(() => removeNotification(id), timeout)
  }
}

const removeNotification = (id: string) => {
  console.log('removeNotification', id)
  const index = notifications.findIndex((item) => item.id === id)
  notifications.splice(index, 1)
}

export function useNotifications() {
  return { notifications, addNotification, removeNotification }
}
