"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TransactionTYPE } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CreateCategorySchema, CreateCategorySchemaType } from '@/schema/categories'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTitle } from '@radix-ui/react-dialog'
import { CircleOff, Loader2, PlusSquare } from 'lucide-react'
import React, { ReactNode, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateCategory } from '../_actions/categories'
import { toast } from 'sonner'
import { Category } from '@prisma/client'
import { useTheme } from 'next-themes'

interface Props {
    type: TransactionTYPE;
    succesCallback: (category: Category) => void;
    trigger?: ReactNode;

}
function CreateCategoryDialog({ type, succesCallback, trigger }: Props) {

    const theme = useTheme()
    const [open, setOpen] = React.useState(false)
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type,
        }
    })
    const queryClient = useQueryClient()
    const {mutate, isPending} = useMutation({
        mutationFn: CreateCategory,
        onSuccess: async (data: Category) => {
           form.reset({
            name: "",
            icon: "",
            type,
           });

          toast.success(`Category ${data.name} created successfully ✅`, {
            id: "create-category",

          });

          succesCallback(data);
          await queryClient.invalidateQueries({ queryKey: ["categories"] });
          setOpen(false);
        },
        onError: (error) => {
          toast.error(`Failed to create category ❌`, {
            id: "create-category",
          });
        },
    })

    const handleSubmit = useCallback( (data: CreateCategorySchemaType) => {
       toast.loading("Creating category", {
         id: "create-category",
       });

       mutate(data);
    },
    [mutate]
    )
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {trigger? trigger : <Button variant="ghost" className="flex border-seperate items-center justify-start roudned-none border-b px-3 py-3 text-muted-foreground">
        
        <PlusSquare className='mr-2 h-4 w-4'/>
        Create Category
    </Button>}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Create <span className={cn("m-1", type === "income" ? "text-emerald-500" : "text-rose-500")}>{type}</span>
                    category
                </DialogTitle>
                <DialogDescription>
                    Categories are used to group your transactions
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input defaultValue={"category"}{...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app 
                  </FormDescription>
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                   <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        value={"outline"}
                        className="h-[100px] w-full">
                            {form.watch("icon") ? (
                                 <div className='flex flex-col items-center gap-2'>
                                 <span className='text-5xl' role='img'>
                                    {field.value}
                                 </span>
                                 <p className='text-xs text-muted-foreground'>change icon</p>
                             </div>
                            ): (
                                <div className='flex flex-col items-center gap-2'>
                                    <CircleOff className="h-[84px] w-[84px]"/>
                                    <p className='text-xs text-muted-foreground'>Choose an icon</p>
                                </div>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full">
                        <Picker data={data} theme={theme.resolvedTheme} onEmojiSelect={(emoji: {native:string}) => {
                            field.onChange(emoji.native)
                        }} />
                    </PopoverContent>
                   </Popover>
                  </FormControl>
                  <FormDescription>
                    Choose an icon for your category, this will appear in the application
                  </FormDescription>
                </FormItem>
              )}
            />
                </form>
            </Form>
       
        <DialogFooter>
            <DialogClose asChild>
              <Button
              type='button'
              variant={"secondary"}
              onClick={() => 
                form.reset()
              }>
                Cancel</Button>
            
            </DialogClose>
            <Button onClick={form.handleSubmit(handleSubmit)} disabled={isPending}>
              {!isPending && "Create"}
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default CreateCategoryDialog