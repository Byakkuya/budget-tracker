"use client"

import {  getCategoriesStatesResponseType } from '@/app/api/stats/categories/route';
import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DateToUTC, GetFormatterForCurrency } from '@/lib/helpers';
import { TransactionTYPE } from '@/lib/types';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react'
import { Progress } from '@/components/ui/progress';



interface Props {
    from : Date;
    to : Date;
    userSettings: UserSettings
}
function CategoriesStats({from,to,userSettings}:Props) {

  const statsQuery = useQuery({

    queryKey : ["stats","overview","categories",from,to],

    queryFn : () => fetch(`/api/stats/categories?from=${DateToUTC(from)}&to=${DateToUTC(to)}`).then((res) => res.json()),
  })

  const formatter = useMemo(()=> {
    return GetFormatterForCurrency(userSettings.currency)
  },[userSettings.currency])
  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const total = income - expense;

  return (
    <div className='flex w-full flex-warp gap-2 md:flex-nowrap'>

        <SkeletonWrapper isLoading={statsQuery.isFetching} fullwidth={true}>

            <CategoriesCard
              formatter={formatter}
              type="income"
              data={statsQuery.data || []}
            />
        </SkeletonWrapper>
        <SkeletonWrapper isLoading={statsQuery.isFetching} fullwidth={true}>

            <CategoriesCard
              formatter={formatter}
              type="expense"
              data={statsQuery.data || []}
            />
        </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats


function CategoriesCard({
  type,
  formatter,
  data,
}: {
  type: TransactionTYPE;
  formatter: Intl.NumberFormat;
  data: getCategoriesStatesResponseType;
}) {
      const filteredData = data.filter((el) => el.type === type);
      const total = filteredData.reduce(
        (acc, el:any) => acc + (el._sum?. amount || 0),
        0
        );  

        return (
          <Card className="w-full h-80">
            <CardHeader>
              <CardTitle className='grid frid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col'>
              {type === 'income' ? 'Income Categories' : 'Expense Categories'}
              </CardTitle>
            </CardHeader>
            <div className="flex items-center justify-between gap-2">
              {filteredData.length === 0 && (

                <div className="flex h-60 w-full flex-col items-center">
                  No data for the selected period
                  <p className='text-sm text-muted-foreground'>
                    Try selecting a different date range or try adding new{' '} {type=== 'income' ? 'Incomes' : 'Expenses'}</p>
                </div>
              )}
              {filteredData.length > 0 && (
                <ScrollArea className='h-60 w-full px-4'>
                  <div className="flex w-full flex-col gap-4 p-4">
                    {filteredData.map((item) => {
                      const amount = item._sum.amount || 0;
                      const percentage = (amount *100 ) / (total ||amount);

                      return (
                        <div key={item.category} className='flex flex-col gap-2'>
                          <div className="flex items-center justify-between">
                          <span className="flex items-centert text-gray-400">
                            {item.categoryIcon} {item.category}
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({percentage.toFixed(0)}%)
                            </span>
                          </span>
                          <span className="text-sm text-gray-400">
                            {formatter.format(amount)}
                          </span>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      )
                      
                    })} 
                  </div>
                </ScrollArea>
              )}
            </div>
          </Card>
        )
      }