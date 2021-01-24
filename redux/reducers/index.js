import { combineReducers } from 'redux';
import businessReducer from './Business';
import vibeReducer from './Vibe';
import userReducer from './User';
import categoryReducer from './Category';
import componentReducer from './Components';

export default combineReducers({
  business: businessReducer,
  vibe: vibeReducer,
  user: userReducer,
  category: categoryReducer,
  component: componentReducer
})
