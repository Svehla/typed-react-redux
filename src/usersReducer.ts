// no user is not defined in the app 
// so we have to write User shape ts type by hands
type User = {
  id: string
  name: string
}

const addUser = (user: User) => ({
  type: 'users/ADD_USER' as const,
  user,
})

const removeUser = (userId: string) => ({
  type: 'users/REMOVE_USER' as const,
  userId,
})

const addAdmin = (user: User) => ({
  type: 'users/ADD_ADMIN' as const,
  user,
})

const removeAdmin = (adminId: string) => ({
  type: 'users/REMOVE_ADMIN' as const,
  adminId,
})
type ActionType = 
  | ReturnType<typeof addUser>
  | ReturnType<typeof removeUser>
  | ReturnType<typeof addAdmin>
  | ReturnType<typeof removeAdmin>

const defaultState = {
  users: [] as User[],
  admins: [] as User[]
}

type State = typeof defaultState

export const usersReducer = (state = defaultState, action: ActionType): State => {
  switch (action.type) {
    case 'users/ADD_USER':
      return { ...state, users: [...state.users, action.user] }
    case 'users/REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(({ id }) => id !== action.userId)
      }
    case 'users/ADD_ADMIN':
      return { ...state, admins: [...state.users, action.user] }
    case 'users/REMOVE_ADMIN':
      return {
        ...state,
        admins: state.admins.filter(({ id }) => id !== action.adminId)
      }
    default:
      return state
  }
}
