import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div>
        <LeftSidebar />
        <div className="">
            <Outlet />
        </div>
    </div>
  )
}

export default MainLayout