import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function GET(reqeust : Request) {

    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const {searchParams} = new URL(reqeust.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const queryParams = OverviewQuerySchema.safeParse({from, to});

    if (!queryParams.success) {
       throw new Error(queryParams.error.message);
    }
    const stats = await getCategoriesStates(user.id, queryParams.data.from, queryParams.data.to);

    return Response.json(stats);
}

export type getCategoriesStatesResponse = Awaited<ReturnType<typeof getCategoriesStates>>

async function getCategoriesStates(userId: string, from: Date, to: Date) {
    const totals = await prisma.transaction.groupBy({
        by: ["type","category","categoryIcon"],
        where: {
            userId,
            date: {
                gte: from,
                lte: to,
            },
        },
       orderBy: {
           _sum: {
               amount: "desc",
           },
       },
        
    });
    return totals;
}