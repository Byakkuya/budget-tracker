'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { DeleteTransaction } from '../_actions/DeleteTransactions';



interface Props {
  open: boolean
  setOpen: (open: boolean) => void;
  transactionId: string;
}

function DeleteTransationDialog({open, setOpen, transactionId}: Props) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
      mutationFn: DeleteTransaction,
      onSuccess: async () => {
          toast.success('transaction deleted successfully ✅', {
              id: transactionId,
          })

          await queryClient.invalidateQueries({
              queryKey: ["transactions"],  
          })
      },
      onError: () => {
          toast.error('Failed to delete transaction ❌', {
              id: transactionId,
          })
      }
      
  })
  
  return (
   
  
    <AlertDialog>
       
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
                        toast.loading('Deleting transaction...', {
                            id: transactionId,
                        })
                        deleteMutation.mutate(transactionId)
                    }}
                    >continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
  
}

export default DeleteTransationDialog