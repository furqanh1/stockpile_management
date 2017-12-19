import {
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,

  AUTH_LOGOUT_SUCCESS,
  AUTH_LOGOUT_FAILURE,
} from '../actionTypes'

const initialState = {
  token: null,
  user: null,
  company: null,
}

export default function(state = initialState, action) {
  switch (action.type) {
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.auth.token,
        user: action.payload.user,
        company: action.payload.company,
        role: action.payload.role
      }

    case AUTH_LOGOUT_SUCCESS:
      return initialState
  }

  return state
}
