import { combineReducers } from 'redux'
import businessReducer from './Business'

export default combineReducers({
  business: businessReducer
})
