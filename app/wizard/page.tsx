import { CurrencyBox } from '@/components/CurrencyBox'
import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { currentUser } from '@clerk/nextjs/server'
import { Currency } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

async function page() {

    const user = await currentUser()

    if (!user) {
      redirect("/sign-in")
    }
  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
      <div>
      <h1 className="text-3xl text-center">
        Welcome <span className="ml-1 font-bold">{user.firstName}! 👋 </span>
      </h1>
      <h2 className="mt-4 text-center text-base text-muted-foreground">
        let&apos;s get started, Select your currency
      </h2>
      <h3 className="mt/2 text-center text-sm text-muted-foreground">
      You can change these settings at any time</h3>
      </div>
      <Separator />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>currency</CardTitle>
          <CardDescription>select your default currency for transactions</CardDescription>
        </CardHeader> 
        <CardContent>
          <CurrencyBox /> 
        </CardContent>
      </Card>
      <Separator />
      <Button className="w-full"><Link href={"/"}>
      Continue
      </Link></Button>
      <div className='mt-16'>
        <Logo />
      </div>
    </div>
  )
}

export default page