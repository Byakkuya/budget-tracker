"use client"

import { Category } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'
import { DeleteCategory } from '../_actions/categories'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { AlertDialogCancel, AlertDialogDescription } from '@radix-ui/react-alert-dialog'
import { TransactionTYPE } from '@/lib/types'

interface Props {
    trigger: React.ReactNode
    category: Category
}

function DeleteCategoryDialog({ trigger, category }: Props) {
    const categoryIdentifier = `${category.name}-${category.type}`;
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async () => {
            toast.success('Category deleted successfully ✅', {
                id: categoryIdentifier,
            })

            await queryClient.invalidateQueries({
                queryKey: ["categories"],  
            })
        },
        onError: () => {
            toast.error('Failed to delete category ❌', {
                id: categoryIdentifier,
            })
        }
        
    })
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the category.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => {
                        toast.loading('Deleting category...', {
                            id: categoryIdentifier,
                        })
                        deleteMutation.mutate({
                            name: category.name,
                            type: category.type as TransactionTYPE,
                        })
                    }}
                    >continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCategoryDialog