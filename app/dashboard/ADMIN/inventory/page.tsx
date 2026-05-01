import React from 'react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import prisma from '@/lib/prisma'

const page = async ({
    searchParams,
}: {
    searchParams: {
        page?: string;
        pageSize?: string;
        search?: string;
        designation?: string;
    };
}) => {

    const inventory = await prisma.inventory.findMany({
        where: {
            product: {
                isInventoryTracked: true,
                active: true
            }
        },
        include: {
            product: true
        }
    })


    const page = Number(searchParams.page) || 0;
    const pageSize = Number(searchParams.pageSize) || 10;
    console.log(inventory)
    return (
        <div>
            <DataTable
                columns={columns}
                data={inventory}
                pageCount={Math.ceil(inventory.length / pageSize)}
                pageSize={pageSize}
                pageIndex={page}
            />
        </div>
    )
}

export default page