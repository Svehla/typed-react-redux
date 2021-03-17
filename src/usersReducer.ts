import { delay } from "./utils"
import { Await, DeepPartial } from "./helperTypes"

// -------- service layer starts ----------
const fetchUsersFromServer = async () => {
  await delay(100)
  // local mock data
  return [
    { id: 'uniq-1', name: 'Foo' },
    { id: 'uniq-2', name: 'Bar' },
    { id: 'uniq-3', name: 'Baz' },
  ]
}

// --------- service layer ends -----------

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

type User = DeepPartial<Await<ReturnType<typeof fetchUsersFromServer>>[number]>

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
