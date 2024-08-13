import React from 'react'
import { Skeleton } from './ui/skeleton'
import { cn } from '@/lib/utils'


function SkeletonWrapper({children,isLoading,fullwidth=true } : {
    children: React.ReactNode
    isLoading: boolean
    fullwidth: boolean
}) {
    if (!isLoading) return children
  // If `isLoading` is true, we render a `Skeleton` component wrapping the `children` with a `div` that has an opacity of 0. This is to ensure that the `children` 
  //are still laid out in the DOM, but are not visible to the user. The `Skeleton` component is styled with the `fullwidth` prop,
  // which adds a `w-full` class to the `Skeleton` component if `fullwidth` is `true`.
  return <Skeleton className={cn(fullwidth && 'w-full')}><div className='opacity-0'>{children}</div></Skeleton>
}


export default SkeletonWrapper