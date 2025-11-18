import React from 'react'
import Dashboard from '../components/Dashboard'
import useUser from '../hooks/useUser'
const Expense = () => {
  useUser();
  return (
    <div>
     <Dashboard activeMenu="Expense">THis is Expense page</Dashboard>
    </div>
  )
}

export default Expense
