"use client"
import { SignUpButton, useUser, UserButton } from "@clerk/nextjs";

const CallToAction = () => {
  const { isSignedIn, user } = useUser();

  return (
    <section id="contact" className="bg-green-600">
      <div className="container mx-auto px-6 py-20 text-center">
        {!isSignedIn ? (
          <>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join our community and start contributing to a greener future today.
            </p>

            {/* Show sign-up modal when not signed in */}
            <SignUpButton mode="modal">
              <button
                className="bg-white text-green-600 font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-200 transition duration-300 shadow-lg transform hover:scale-105 inline-block"
              >
                Sign Up Now
              </button>
            </SignUpButton>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome back, {user?.firstName || "Eco Hero"}! 🌱
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Thanks for being part of our mission. Explore new ways to help the planet today.
            </p>

            {/* Example: Link to user dashboard or personalized actions */}
            <a
              href="/dashboard"
              className="bg-white text-green-600 font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-200 transition duration-300 shadow-lg transform hover:scale-105 inline-block"
            >
              Go to Dashboard
            </a>

            <div className="mt-6">
              <UserButton afterSignOutUrl="/" />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CallToAction;
