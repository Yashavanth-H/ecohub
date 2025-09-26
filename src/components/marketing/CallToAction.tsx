// src/components/marketing/CallToAction.tsx
import Link from 'next/link';

const CallToAction = () => {
  return (
    <section id="contact" className="bg-green-600">
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl text-green-100 mb-8">
          Join our community and start contributing to a greener future today.
        </p>
        <Link 
          href="/signup"
          className="bg-white text-green-600 font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-200 transition duration-300 shadow-lg transform hover:scale-105 inline-block"
        >
          Sign Up Now
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;