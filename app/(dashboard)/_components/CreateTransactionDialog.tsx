"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionTYPE } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { ReactNode, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";

interface Props {
  trigger: ReactNode;
  type: TransactionTYPE;
}

function CreateTransactionDialog({ trigger, type }: Props) {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const handleCategoryChange = useCallback((value: string) => {
    form.setValue("category", value);
  }, [form]);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Create a new{" "}
          <span
            className={cn(
              "m-1",
              type === "income" ? "text-emerald-500" : "text-rose-500"
            )}
          >
            {type}
          </span>{" "}
          transaction
        </DialogTitle>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit((data) => {
              // handle form submission here
              console.log(data);
            })}
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue={""}{...field} />
                  </FormControl>
                  <FormDescription>
                    Add a description for this transaction (optional)
                  </FormDescription>
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction amount (optional)
                  </FormDescription>
                </FormItem>
              )}
            />
            Transaction: {form.watch("category")} {/* // watch for changes in the category field*/}
            <div className="flex items-center justify-between gap-4">
            <FormField 
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row gap-4 items-center">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                   <CategoryPicker type={type} onchange={handleCategoryChange} />
                  </FormControl>
                  </div>
                  <FormDescription>
                    Select a category for the transaction
                  </FormDescription>
                </FormItem>
              )}
            />
            </div>


            <button type="submit">Submit</button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTransactionDialog;
