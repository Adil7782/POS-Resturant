
export const dynamic = "force-dynamic";

import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';
import ProductsTable from './_components/products-table';

import { ProductDialog } from './_components/product-mini-form';
import { getUserFromToken } from '@/lib/getuser';

export const metadata = {
  title: 'Products - Swift Flow',
  description: 'Product Management'
};

export default async function ProductsPage() {
  const user = await getUserFromToken();


  if (!user || user.role !== 'ADMIN') {
    redirect('/login');
  }

  try {
    const prods = await prisma.product.findMany({
      where: {
        active: true
      },
      include: {
        category: true,
        inventory: true
      }
    });
    const products = prods.map(p => ({
      ...p,
      category: p.category.name,
    }));
    const categories = await prisma.category.findMany();

    // Group by category
    // const categories = Array.from(new Set(products.map(p => p.category)));

    return (
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center bg-background top-0 sticky py-2 z-10">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-2">View and manage menu items</p>
          </div>
          <ProductDialog categories={categories} />
        </div>

        <ProductsTable products={products} categories={categories} />
      </div>
    );
  } catch (error) {
    console.error('Error loading products:', error);
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold">Error Loading Products</h2>
          <p className="text-muted-foreground mt-2">Please refresh the page</p>
        </div>
      </div>
    );
  }
}
