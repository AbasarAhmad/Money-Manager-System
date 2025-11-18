import React from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
const Income = () => {
  useUser();
  return (
    <div>
     <Dashboard activeMenu="Income">THis is  Income page</Dashboard>
    </div>
  )
}

export default Income
