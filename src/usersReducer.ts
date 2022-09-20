import { delay } from "./utils"
import { Await, DeepPartial } from "./helperTypes"
import { defineReduck } from "./reduxHelperTypes"

type User = DeepPartial<Await<ReturnType<typeof fetchUsersFromServer>>[number]>

const defaultState = {
  users: [] as User[],
  admins: [] as User[]
}

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

export const {
  actions: userActions,
  reducer: usersReducer,
} = defineReduck(
  {
    ddUser: (user: User) => ({
      type: 'users/ADD_USER' as const,
      user,
    }),

    removeUser: (userId: string) => ({
      type: 'users/REMOVE_USER' as const,
      userId,
    }),

    addAdmin: (user: User) => ({
      type: 'users/ADD_ADMIN' as const,
      user,
    }),

    removeAdmin: (adminId: string) => ({
      type: 'users/REMOVE_ADMIN' as const,
      adminId,
    }),
  },

  defaultState,

  (state, action) => {
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
)



