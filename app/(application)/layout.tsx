
import Header from '@/components/layout/header'
import type React from 'react'

export default async function DashBoardlayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <div className="h-dvh w-full">
     
     <Header />
        {children} 
    </div>
  )
}