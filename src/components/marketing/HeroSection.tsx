// src/components/marketing/HeroSection.tsx
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            A Smarter Way to Recycle and Reuse.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0 mb-10">
            Connect with businesses and consumers to buy, sell, and trade reusable products. Harness the power of AI to build a sustainable future.
          </p>
          <Link 
            href="/signup"
            className="bg-green-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-green-700 transition duration-300 inline-block"
          >
            Start Your Eco Journey
          </Link>
        </div>

        {/* Hero Image */}
        <div className="hidden md:flex justify-center items-center rounded-2xl h-96 overflow-hidden">
          <Image 
            src="/assets/hero.png" 
            alt="Sustainable Marketplace" 
            width={600} 
            height={400} 
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;