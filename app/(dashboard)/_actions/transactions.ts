"use server"

import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form : CreateTransactionSchemaType) {
    const parsedBody = CreateTransactionSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error("bad request")
    }
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }
    const { amount, date, category, description, type } = parsedBody.data;
    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category,
        }
    });

    if (!categoryRow) {
        throw new Error("category not found")
    }
    // don't confuse between $transaction (prisma ) and prisma.transaction (table)
    // $transaction : Allows the running of a sequence of read/write operations
    //that are guaranteed to either succeed or fail as a whole.
    await prisma.$transaction([
        // create a transaction
        prisma.transaction.create({
            data: {
                userId : user.id,
                amount,
                date,
                description: description || "",
                type,
                category : categoryRow.name,
                categoryIcon : categoryRow.icon
                
            },
        }),
        
        // Update the monthHistory  aggreagate table. 
        //This table stores the aggregate income and expense
        // for each month for a user. The upsert function is used to either create a new row
        // or update an existing row. The operation is guaranteed to be atomic, meaning it
        // either fails entirely or succeeds entirely.
        //
        // The where clause specifies the unique identifier for the row. In this case, the
        // identifier is a combination of the year, month, day, and userId.
        //
        // The create clause specifies the data to be inserted if the row does not already
        // exist.
        //
        // The update clause specifies the data to be updated if the row already exists. The
        // increment function is used to increment the expense or income fields by the
        // amount of the transaction.
        //
        // The type comparison is used to determine whether the transaction is an expense or
        // income. If the transaction is an expense, the expense field is incremented by the
        // amount of the transaction. If the transaction is an income, the income field is
        // incremented by the amount of the transaction.
        //
        // This operation is used to update the aggregates for the month corresponding to the
        // transaction.
        prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId : user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create: {
                userId : user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === "expense" ? amount : 0,
                },
                income: {
                    increment: type === "income" ? amount : 0,
                },
            },
        }),
        // update year aggregate
        prisma.yearHistory.upsert({
            where: {
                month_year_userId: {
                    userId : user.id,
                    
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                }
            },
            create: {
                userId : user.id, 
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                expense: type === "expense" ? amount : 0,
                income: type === "income" ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === "expense" ? amount : 0,
                },
                income: {
                    increment: type === "income" ? amount : 0,
                },
            },
        })

    ])

    
}