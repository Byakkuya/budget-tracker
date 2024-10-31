"use client"
import { DateToUTC } from '@/lib/helpers'
import { useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
  } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import SkeletonWrapper from '@/components/SkeletonWrapper'
import { DataTableColumnHeader } from '@/components/datatable/ColumnHeader'
import { cn } from '@/lib/utils'
import { DataTableViewOptions } from '@/components/datatable/ColumnToggle'
import { Button } from '@/components/ui/button'

import { download, generateCsv, mkConfig } from "export-to-csv"
import { Download, DownloadIcon, MoreHorizontal } from 'lucide-react'
import { Dropdown } from 'react-day-picker'
import { DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { TrashIcon } from '@radix-ui/react-icons'
import DeleteTransationDialog from './DeleteTransationDialog'
interface Props {
    from: Date
    to: Date
}

const emptyData: any[] = []

type TransactionHistoryRow = {
  id: string;
  formattedAmount: string;
  amount: number;
  category: string;
  categoryIcon: string;
  // other transaction properties
};

 const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: 'category',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),

    filterFn: (row, id, value) => {
      // If value is an array (for multiple selections), use `.some()` to check if the row's value is included
      if (Array.isArray(value)) {
        return value.some(v => v === row.getValue(id));
      }
      // Otherwise, it's a single value, so check for equality
      return row.getValue(id) === value;
    },
    
    cell: ({ row }) => {
      const data = row.original as TransactionHistoryRow;
      console.log(data)
      return (
        <div className='flex gap-4 capitalize'>
          {/* Display formatted amount */}
          {data.categoryIcon || 'No Icon'}
          {/* Display category icon */}
          <div >
            {data.category || 'No Icon'}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {/* @ts-ignore */}
        {row.original.description || 'No Description'}
      </div>
    ),
  },
  {
    accessorKey: 'date',
    header: "Date",
    cell: ({ row }) => {
      // @ts-ignore
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("default",{
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return <div className="text-muted-foreground">
        {formattedDate}
      </div>
    }
  },
  {
    accessorKey: 'type',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      // @ts-ignore
      <div className={cn("capitalize rounded-lg text-center p-2 ", row.original.type === "income" && "bg-emerald-400/10 text-emerald-400",
        // @ts-ignore
        row.original.type === "expense" && "bg-rose-400/10 text-rose-400",
      )}>
        {/* @ts-ignore */}
        {row.original.type || 'No typet'}
        
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    filterFn: (row,id,value) => {
      return value.includes(row.getValue(id))
    },
    cell: ({ row }) => (
      <p className="text-md rounded-lg bg-gray-400/5 p-2 text-center">
        {/* @ts-ignore */}
        {row.original.formattedAmount || 'No amount'}
        
      </p>
    ),
  },
  {
    id:"actions",
    enableHiding: false,
    cell: ({ row }) => (
      <RowActions transaction={row.original} />
    ),
  },
  
];


const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
})

function TransactionsTable({ from, to }: Props) {
  const [sorting,setSorting] = useState<SortingState>([])
  const [columnFilters,setColumnFilters] = useState<ColumnFiltersState>([])
  const history = useQuery<TransactionHistoryRow[]>({
    queryKey: ["transactions", "history", from, to],
    queryFn: () => fetch(`/api/transactions-history?from=${DateToUTC(from)}&to=${DateToUTC(to)}`).then((res) => res.json())
  });

  const handleExportCSV =(data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  }

  const table = useReactTable({
    data: history.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      }
    },
    state: {
      sorting,
      columnFilters,
    },  
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  

  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map();
    history.data?.forEach((transaction) => {
      categoriesMap.set(transaction.category, {
        Value: transaction.category,
        label: `${transaction.categoryIcon} (${transaction.category})`,
      });
    });
    const uniqueCategories = new Set(categoriesMap.values());
    return Array.from(uniqueCategories);
    
  }, [history.data])
  return (
   <div className=" w-full">
    
    <div className="flex flex-wrap items-end justify-between gap-2 py-4">
     <div className="flex gap-2">
      
     </div>
     <div className="flex flex-warp gap-2">
     <Button 
      variant={"outline"}
      size={"sm"}
      className="ml-auto h-8 lg:flex"
      onClick={() =>{
        const data = table.getFilteredRowModel().rows.map(row =>
       ( {
          category: row.original.category,
          categoryIcon: row.original.categoryIcon,
          description: row.original.description,
          type: row.original.type,
          amount: row.original.amount,
          formattedAmount: row.original.formattedAmount,
          date: row.original.date
        }
        ))
        handleExportCSV(data);
      }}
     >
      <DownloadIcon className="mr-2 h-4 w-4" />
      Export CSV
     </Button>
      <DataTableViewOptions table={table} />
     </div>
    </div>
     <SkeletonWrapper isLoading={history.isFetching} fullwidth={false}> 
<div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </SkeletonWrapper>
   </div>
  );
}

export default TransactionsTable;

function RowActions ({transaction}: {transaction:TransactionHistoryRow}) {

  const [showDeleteDialog,setShowDialog] = useState(false);
  if (showDeleteDialog) {
    console.log(showDeleteDialog)
  }
  return (
    <>
    <DeleteTransationDialog open={showDeleteDialog} setOpen={setShowDialog} transactionId={transaction.id} />
    
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={"ghost"} className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4'/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
    <DropdownMenuLabel> Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="flex items-center gap-2"
    onSelect={() => setShowDialog(prev => !prev)}>
      <TrashIcon className='h-4 w-4 text-muted-foreground' />
      Delete
    </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  )

}