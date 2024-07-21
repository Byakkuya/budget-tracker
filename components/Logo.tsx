import { HandCoins, Landmark } from 'lucide-react'
import React from 'react'

function Logo() {
  return (
    <a href="/" className='flex items-center gap-2'>
        <HandCoins className='stroke w-12 h-12 stroke-blue-500 stroke-[1.5]'/>
        <p className='bg-gradient-to-r from-blue-300 to-blue-500 
        bg-clip-text text-3xl font-extrabold text-transparent'>coinKeeper</p>
    </a>
  )
}
// mobile version 

export function MobileLogo() {
  return (
    <a href="/" className='flex items-center gap-2'>

        <p className='bg-gradient-to-r from-blue-300 to-blue-500 
        bg-clip-text text-3xl font-extrabold text-transparent'>coinKeeper</p>
    </a>
  )
}

export default Logo 