// src/components/marketplace/ProductGrid.tsx
import ProductCard, { ProductCardProps } from '@/components/products/ProductCard';

type ProductGridProps = {
  products: ProductCardProps[];
};

const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return <p className="text-gray-600">No products found. Try adjusting your filters.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductGrid;