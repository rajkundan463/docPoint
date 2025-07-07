import React, { useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

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
    <Layout>
       <h1>Home Page</h1>
      </Layout>
      
  )
}

export default Home;
