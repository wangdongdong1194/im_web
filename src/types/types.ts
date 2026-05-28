export interface ConversationPreview {
  id: number
  name: string
  lastMessage: string
  lastTime: string
  unread: number
  avatar: string
}

export interface ChatMessage {
  id: number
  sender: 'me' | 'other'
  text: string
  time: string
}
