"use client"
import { GetBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card } from '@/components/ui/card';
import { DateToUTC, GetFormatterForCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Scale, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useCallback, useMemo } from 'react'
import CountUp from 'react-countup';
interface Props {
    from : Date;
    to : Date;
    userSettings: UserSettings
}

function StatsCards({from,to,userSettings}:Props) {


    const statsQuery = useQuery<GetBalanceStatsResponseType>({

        queryKey : ["stats","overview",from,to],

        queryFn : () => fetch(`/api/stats/balance?from=${DateToUTC(from)}&to=${DateToUTC(to)}`).then((res) => res.json()),

    });
    const formatter = useMemo(()=> {
        return GetFormatterForCurrency(userSettings.currency)
    },[userSettings.currency]);
    const income = statsQuery.data?.income || 0;
    const expense = statsQuery.data?.expense || 0;
    const total = income - expense;
  return (
    <div className='relative flex w-full flex-wrap gap-2 md:flex-nowrap'>
        <SkeletonWrapper isLoading={statsQuery.isFetching} fullwidth={true}>

            <StatCard 
                formatter={formatter}
                value={income}
                title="Income"
                icon={
                    <TrendingUp className='h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emeral-400/10'></TrendingUp>
                }
                />
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={statsQuery.isFetching} fullwidth={true}>

            <StatCard 
                formatter={formatter}
                value={expense}
                title="expense"
                icon={
                    <TrendingDown className='h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10'></TrendingDown>
                }
                />
        </SkeletonWrapper>

        <SkeletonWrapper isLoading={statsQuery.isFetching} fullwidth={true}>

            <StatCard 
                formatter={formatter}
                value={total}
                title="Total"
                icon={
                    <Scale className='h-12 w-12 items-center rounded-lg p-2 text-blue-500 bg-blue-400/10'></Scale>
                }
                />
        </SkeletonWrapper>
    </div>
  )
}

export default StatsCards

function StatCard({formatter,value,title,icon}:{

    formatter : Intl.NumberFormat,
    title: String,
    value: number,
    icon : React.ReactNode
}) {

    const formatFn = useCallback((value:number)=>{
        return formatter.format(value)
    },[formatter])
    
    return (
        <Card className="w-full flex h-24 items-center gap-2 p-4 ">
            
            {icon}
            <div className="flex flex-col items-center gap-0">
                <p className="text-muted-foreground ">{title}</p>
                <CountUp 
                    preserveValue
                    redraw={false}
                    end={value} 
                    decimals={2}
                    formattingFn={formatFn}
                    className="text-2xl"
                    />
            </div>
            
             </Card>
    )
}