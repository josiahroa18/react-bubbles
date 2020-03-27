import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route
  const [ credentials, setCredentials ] = useState({
    username:'',
    password:''
  });
  const [ error, setError ] = useState(false);
  const history = useHistory();

  const handleChange = e => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/login', credentials)
    .then(res => {
      setError(false);
      window.localStorage.setItem('token', res.data.payload);
      history.push('/bubble');
    })
    .catch(() => {
      setError(true);
    })
  }

  return (
    <div className='login-page'>
      <h1>Welcome to the Bubble App!</h1>
      {error && (
        <p>Username or password incorrect, please try again</p>
      )}
      <form onSubmit={handleSubmit} className='login-form'>
        <label>Username</label>
        <input
          name='username'
          type='text'
          value={credentials.username}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          name='password'
          type='password'
          value={credentials.password}
          onChange={handleChange}
        />
        <input type='submit' value='Login' className='login-button'/>
      </form>
    </div>
  );
};

export default Login;
