"use client"

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react'
import { toast } from 'sonner';
import TransactionsTable from './_components/TransactionsTable';

function TransactionsPage() {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth (new Date()),
        to: new Date(),
        });
  return (
    <>
        <div className='border-b bg-card'>
        <div className='container flex flex-warp items-center justify-between gap-2 py-8'>
            <div>
                <p className='text-3xl font-bold'>Transactions history</p>
            </div>
            <DateRangePicker 
                    initialCompareFrom={dateRange.from}
                    initialCompareTo={dateRange.to}
                    showCompare={false}
                    onUpdate={(values) => {
                        const {from,to} = values.range;
                    // we update the date range only if both from and to are set
                        if (!from || !to) return;
                        if (differenceInDays(to,from) > MAX_DATE_RANGE_DAYS) {
                            toast.error(`The selected date range in too big. Please select a date range up to ${MAX_DATE_RANGE_DAYS} days.`);
                            return;    
                        }
                        setDateRange({from, to});
                    }}
                />
           
    </div>
        </div>

    <div className="container">
        <TransactionsTable from={dateRange.from} to={dateRange.to} />
    </div>
    </>
        
        
        
  )
}

export default TransactionsPage