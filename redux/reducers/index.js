import { combineReducers } from 'redux'
import businessReducer from './Business'
import vibeReducer from './Vibe'
import userReducer from './User'

export default combineReducers({
  business: businessReducer,
  vibe: vibeReducer,
  user: userReducer
})
