import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import axios from 'axios';

// Register User
export const registeruser = (userData, history) => (dispatch) => {
  axios
  .post('/api/users/register', userData)
  .then(res => history.push('/login'))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
    })
  );
};

// Login - Get user Token
export const loginUser = (userData) => dispatch => {
    axios
    .post('/api/users/login', userData)
    .then(res => {
        // Save to localStorage
        const { token } = res.data;
        // Set token to localStorage
        localStorage.setItem('jwtToken', token);
        // Set token to Auth Header
        setAuthToken(token);
        // Decode token ot get user data
        const decoded = jwt_decode(token);
        // Set curent user
        dispatch(setCurrentUser(decoded));
    })
    .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    })
    );
};

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// Log user out
export const logoutUser = () => dispatch => {
    // remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove Remove aut header fo rfuture requests
    setAuthToken(false);
    // Set current user to empty object {} which
    // will set isAuthenticated to false
    dispatch(setCurrentUser({}));
}