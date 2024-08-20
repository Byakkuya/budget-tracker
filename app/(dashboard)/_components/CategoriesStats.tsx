"use client"

import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import { DateToUTC, GetFormatterForCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react'



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
    <div className='flex w-full fle'>CategoriesStats</div>
  )
}

export default CategoriesStats