import { combineReducers } from 'redux'
import businessReducer from './Business'
import vibeReducer from './Vibe'

export default combineReducers({
  business: businessReducer,
  vibe: vibeReducer
})
