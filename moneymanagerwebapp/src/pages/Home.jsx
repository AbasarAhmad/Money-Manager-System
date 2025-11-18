import React from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'

const Home = () => {
  useUser();
  return (
    <Dashboard activeMenu="Dashboard">
  This is home page
</Dashboard>

  )
}

export default Home
