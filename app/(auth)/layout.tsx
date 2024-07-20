import Logo from '@/components/Logo'
import React from 'react'

function layout({children}:{children:React.ReactNode})  {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
        <Logo />
{/*         <p className='animate-text bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 bg-clip-text text-transparent text-2xl font-black'>best way to keep track of your money</p>
 */}        <div className='mt-12'>{children}</div>
    </div>
  )
}

export default layout