

const ADD_USER = 'users/ADD_USER' as const
const REMOVE_USER = 'users/REMOVE_USER' as const
const ADD_ADMIN = 'users/ADD_ADMIN' as const
const REMOVE_ADMIN = 'users/REMOVE_ADMIN' as const

// no user is not defined in the app 
// so we have to write User shape ts type by hands
type User = {
  id: string
  name: string
}

const addUser = (user: User) => ({
  type: ADD_USER,
  user,
})

const removeUser = (userId: string) => ({
  type: REMOVE_USER,
  userId,
})

const addAdmin = (user: User) => ({
  type: ADD_ADMIN,
  user,
})

const removeAdmin = (userId: string) => ({
  type: REMOVE_ADMIN,
  userId,
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
    case ADD_USER:
      return { ...state, users: [...state.users, action.user] }
    case REMOVE_USER:
      return {
        ...state,
        users: state.users.filter(({ id }) => id !== action.userId)
      }
    case ADD_ADMIN:
      return { ...state, admins: [...state.users, action.user] }
    case REMOVE_ADMIN:
      return {
        ...state,
        admins: state.admins.filter(({ id }) => id !== action.userId)
      }
    default:
      return state
  }
}
