import React, { useEffect } from 'react';
import axios from 'axios';

function Home() {
  //  an API call to fetch user data 
  const getData = async () => { 
    try {
      const response = await axios.post('/api/user/get-user-info-by-id',{}, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'), // Assuming token is stored in localStorage
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  useEffect(() => {
    getData();
  }, []);


  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of your application.</p>
    </div>
  )
}

export default Home;
