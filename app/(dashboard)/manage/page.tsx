"use client"
import { CurrencyBox } from '@/components/CurrencyBox'
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionTYPE } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { PlusSquare, Trash2Icon, TrendingDown, TrendingUp } from 'lucide-react'
import React from 'react'
import { CreateCategory } from '../_actions/categories'
import CreateCategoryDialog from '../_components/CreateCategoryDialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Category } from '@prisma/client'
import DeleteCategoryDialog from '../_components/DeleteCategoryDialog'

function page() {
  return (
   <>
    <div className="border-b bg-card">
      <div className="container flex flex-warp items-center justify-between gap-4 py-8">
        <div>
        <p className="text-3xl font-bold">Manage</p>
        <p className="text-muted-foreground"> Manage your account settings and categories</p>
        </div>

      </div>
    </div>

    <div className="container flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>select your default currency for transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyBox />
        </CardContent>
      </Card>
      <CategoryList type="income" />
      <CategoryList type="expense" />
    </div>
   </>
  )
}

export default page


function CategoryList({ type }: { type:TransactionTYPE }) {
  const categoriesQuery = useQuery({

    queryKey: ["categories", type],

    queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  })

  const dataAvailable  = categoriesQuery.data && categoriesQuery.data.length > 0
  return (
    <SkeletonWrapper isLoading={categoriesQuery.isFetching} fullwidth={true}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
           {type === "income" ? (<TrendingUp className="h-12 w-12 items-center rounded-lg text-emerald-500 bg-emerald-400/10" />) : 
           (<TrendingDown className="h-12 w-12 items-center rounded-lg text-red-500 bg-red-400/10" />)}
           <div> {type === "income" ? "Income " : "Expense "} Categories
            <div className="text-sm text-muted-foreground">
              Sorted by name
            </div>
          </div>
          </div>
          
          <CreateCategoryDialog type={type} succesCallback={() => categoriesQuery.refetch()}
            trigger={
              <Button className="gap-2 text-sm">
                <PlusSquare className="h-4 w-4" />
                New Category
              </Button>
            } />
        </CardTitle>
      </CardHeader>
      <Separator />
      {
        !dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p className="text-center text-sm text-muted-foreground">No categories added</p>
          </div>
        )
      }

      {dataAvailable && (
        <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categoriesQuery.data.map((category: Category) => (
            <CategoryCard category={category} key={category.name} />
          ))}
        </div>
)      }
    </SkeletonWrapper>
  )
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flexc border-seperate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className='text-3xl' role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <DeleteCategoryDialog category={category} trigger={
        <Button className='flex w-full border-seperate items-center gap-2 rounded-t-none text-ùuted-foreground hover:bg-red-500/20'
        variant={"secondary"}>
          <Trash2Icon className="h-4 w-4" />
          Delete
        </Button>
      } />
      
    </div>
  )
}