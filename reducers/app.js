import { REHYDRATE } from 'redux-persist/constants'

const initialState = {
  ready: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...state,
        ready: true
      }
  }

  return state
}
