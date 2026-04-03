// Generates a consistent room ID for two users
// Sorted so A+B and B+A always produce the same room
export const getPrivateRoomId = (userIdA, userIdB) => {
  return [userIdA, userIdB].sort().join('_')
}

export const GENERAL_ROOM = 'general'
export const AI_ROOM = 'ai_room'