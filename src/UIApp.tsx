import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { asyncValueChange, divide } from './counterReducer'
import { GlobalState } from './App';

const getCounterValue = (state: GlobalState) => state.helpers.counter.value
const getAdminsLength = (state: GlobalState) => state.users.admins.length
const getUsersLength = (state: GlobalState) => state.users.users.length

export const UIApp = () => {
  const dispatch = useDispatch()
  const counterValue = useSelector(getCounterValue)
  const adminsLength = useSelector(getAdminsLength)
  const usersLength = useSelector(getUsersLength)

  return (
    <div>
      <div>
        admins length: {adminsLength}
      </div>
      <div>
        users length: {usersLength}
      </div>
      <div>
        {counterValue}
      </div>
      <button onClick={() => { dispatch(asyncValueChange(200))}}>make 200ms async operation</button>
      <button onClick={() => { dispatch(asyncValueChange(400))}}>make 400ms async operation</button>
      <button onClick={() => { dispatch(asyncValueChange(800))}}>make 800ms async operation</button>
      <button onClick={() => { dispatch(divide(5))}}>divide by 5</button>
    </div>
  )
}
