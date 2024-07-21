"use client"
import { ThemeProvider } from 'next-themes'
import React from 'react'

function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      >
      {children}

    </ThemeProvider>
  )
}

export default RootProviders