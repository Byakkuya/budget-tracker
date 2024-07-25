import Navbar from '@/components/Navbar'
import React from 'react'

function layout({children}:{children:React.ReactNode})  {
  return (
    <div className="relative flex h-screen w-full">
      <div className='w-full'>
        <Navbar />
        {children}
      </div>
      </div>
  )
}

export default layout