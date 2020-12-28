import axios from 'axios';

export const setAuthToken = token => {
    if (token) {
        // log user in
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        // delete the token from headers to log user out
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const signup = (userData) => {
  return axios.post('/api/users/register', userData);
};

export const login = (userData) => {
  return axios.post('/api/users/login', userData);
};