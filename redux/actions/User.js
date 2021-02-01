import { Update_Radius, Fetch_User, SET_LOCATION, update_User, Progression_Bar, } from '../types'; 
import { graphql, stripIgnoredCharacters } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData , storeUserData} from '../../src/components/localStorage'; 

export const updateRadius = (radius) => async (dispatch, getState) => {
  const { token } = await getUserData();
  console.log("in update radius", radius)
  const body = {
      query:`
      mutation{
        updateRadius(radius: ${ parseInt(radius)}){
            firstName
            radius
            lastName
            email
            dob
        }
      }
      `
    }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    dispatch({
      type: Update_Radius,
      payload: res.data.data.updateRadius.radius,
    })
    return Promise.resolve(res.data.data.updateRadius.radius);
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
}

export const getUser = () => async (dispatch, getState) => {
  const { token } = await getUserData();
  const body = {
    query:`
      query{
        getUser{
            _id
            firstName
            lastName
            email
            dob
            radius
            profilePic
            gender
            accountType,
            phoneNumber
        }
      }
    ` 
  }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    dispatch({
      type: Fetch_User,
      payload: res.data.data.getUser,
    })
    return Promise.resolve('ok');
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
}

export const updateUser = ({existingEmail,newEmail ,firstName, lastName, date, gender, profilePic}) => async (dispatch, getState) => {
  const { token } = await getUserData();
  console.log(`${existingEmail} ,${newEmail}, ${firstName}, ${lastName}, ${date}, ${gender}, ${profilePic}`);
  
  let applyNewEmail = newEmail ? newEmail : "notApply"
  console.log("apple new", applyNewEmail)
  const body = {
    query: `
    mutation{
      updateUser(userInput: {newEmail: "${applyNewEmail}",
      existingEmail: "${existingEmail}",
      profilePic: "${profilePic}",
      firstName: "${firstName}", lastName: "${lastName}", 
      , dob: "${date}",  gender: "${gender}"})
      {
        user{
          _id
          firstName
          radius
          lastName
          email
          dob
          accountType
          profilePic
          gender
          phoneNumber
        }
        isSameEmail
      }
    }
    `
  }
  try{
  const res = await axios.post('graphql?',body,{ headers: {
    'Authorization': `Bearer ${token}`
  }})
    console.log("after update", res.data.data);
    if(res.data.data.updateUser){
      dispatch({
        type: update_User,
        payload: res.data.data.updateUser.user,
      })
      console.log("the is paswword chane", res.data.data.updateUser.isSameEmail)
    }
    return (res.data.data.updateUser.isSameEmail) 
  }
  catch(err){
    console.log("the erororr", err.response.data)
    const { errors } = err.response.data;
    const { message } = errors[0];
    return Promise.reject(message) 
  }
}

export const setUserLocation = (data) => async (dispatch, getState) => {
  dispatch({
    type: SET_LOCATION,
    payload: {...data,
      latitude: data.latitude.toFixed(5),
      longitude: data.longitude.toFixed(5) 
    }
  })
}
export const setProgressionBar = (data) => async (dispatch, getState) => {
  console.log("the bar", data)
  dispatch({
    type: Progression_Bar,
    payload: data
  })
}


