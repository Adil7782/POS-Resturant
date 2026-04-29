
import POSInterface from '@/components/pos-interface'
import { getUserFromToken } from '@/lib/getuser'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {

    const user = await getUserFromToken()
    if (!user) {
        redirect("/login")
    }

    const productsData = await prisma.product.findMany({
        include: {
            inventory: true,
            category: true,
        },
        where: {
            active: true,
        },
    });

    const products = productsData.map(product => ({
        ...product,
        category: product.category.name,
    }));


    return (
        <div>
            <POSInterface products={products} userId={user.id} />
        </div>
    )
}

export default page