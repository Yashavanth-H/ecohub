// src/components/products/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';

// Define the type of data the component expects
export type ProductCardProps = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
};

const ProductCard = ({ id, name, category, price, imageUrl }: ProductCardProps) => {
  return (
    <Link href={`/products/${id}`} className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div className="relative h-56 w-full">
        <Image
          src={imageUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 bg-white">
        <p className="text-sm text-gray-500 mb-1">{category}</p>
        <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>
        <p className="mt-2 text-xl font-semibold text-green-600">${price.toFixed(2)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;