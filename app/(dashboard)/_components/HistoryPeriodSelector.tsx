"use client"

import React from 'react'
import { Period, TimeFrame } from '@/lib/types'
import { useQueries, useQuery } from '@tanstack/react-query';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GetHistoryPeriodsResponseType } from '@/app/api/History/route';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    period: Period;
    setPeriod :(period:Period) => void;
    timeframe: TimeFrame;
    setTimeframe: (timeframe:TimeFrame) => void;
   
}
function HistoryPeriodSelector( {period, setPeriod, timeframe, setTimeframe}: Props) {

    const historyPeriods  = useQuery<GetHistoryPeriodsResponseType>({
        queryKey: ["history","overview","periods"],
        queryFn: async () => fetch(`/api/History`).then((res) => res.json()),
    })
  return (
    <div className='flex flex-warp items'>
      <SkeletonWrapper  fullwidth={false} isLoading={historyPeriods.isFetching}>
          <Tabs value={timeframe} 
          onValueChange={(value)=> setTimeframe(value as TimeFrame)}>
            <TabsList>
              <TabsTrigger value="year">Year</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-warp items-center gap-2	">
        <SkeletonWrapper isLoading={historyPeriods.isFetching} fullwidth={false}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriods.data || []}
          />
        </SkeletonWrapper>
        {timeframe === "month" && (
          <SkeletonWrapper isLoading={historyPeriods.isFetching} fullwidth={false}>
            <MonthSelector
              period={period}
              setPeriod={setPeriod}
            />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  )
}

export default HistoryPeriodSelector



function YearSelector({period, setPeriod, years}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriodsResponseType;
}){
    return (
      <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        })
     
        }
      }
      >
<SelectTrigger className='w-[180px]'>
  <SelectValue/>
</SelectTrigger>
<SelectContent>
  {
    years.map((year)=>(
      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
    ))
  }
</SelectContent>
      </Select>
    )
}

function MonthSelector({period, setPeriod}: {
  period: Period;
  setPeriod: (period: Period) => void;}
){ 
    return (
      <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          
          year: period.year,
          month:parseInt(value),
        })
     
        }
      }
      >
<SelectTrigger className='w-[180px]'>
  <SelectValue/>
</SelectTrigger>
<SelectContent>
  {
    [0,1,2,3,4,5,6,7,8,9,10,11].map((month)=> {

      const monthStr = new Date(period.year, month, 1).toLocaleString('default', { month: 'long' })
      return (
        <SelectItem key={month} value={month.toString()}>{monthStr}</SelectItem>

      )
    
    })
  }
</SelectContent>
      </Select>
    )
}