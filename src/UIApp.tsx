import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { asyncValueChange, counterActions } from './counterReducer'
import { createIdentitySelectors } from './reduxHelperTypes';

const selectors = createIdentitySelectors({
  getCounterValue: (state) => state.helpers.counter.value,
  getAdminsLength:  (state) => state.users.admins.length,
  getUsersLength: (state) => state.users.users.length
})

export const UIApp = () => {

  const dispatch = useDispatch()
  const counterValue = useSelector(selectors.getCounterValue)
  const adminsLength = useSelector(selectors.getAdminsLength)
  const usersLength = useSelector(selectors.getUsersLength)

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
      <button onClick={() => { dispatch(counterActions.divide(5))}}>divide by 5</button>
    </div>
  )
}

