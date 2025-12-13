import { SignedIn, SignedOut, SignInButton, SignUpButton , UserButton} from '@clerk/nextjs';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo - Changed text-gray-800 to text-green-600 */}
        <Link href="/" className="text-2xl font-bold text-green-600">
          EcoMarket
        </Link>
        
        {/* Centered Navigation Links - Changed text-gray-600 to 700 for slightly better contrast */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-gray-700 hover:text-green-600">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-700 hover:text-green-600">
            How It Works
          </Link>
          <Link href="/buy" className="text-gray-700 hover:text-green-600">
            Buy/Sell
          </Link>
          <Link href="#contact" className="text-gray-700 hover:text-green-600">
            Contact
          </Link>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <SignedOut>
            {/* LOGIC FIX: SignInButton should wrap the "Login" button */}
            <SignInButton  mode="modal" >
              <button className="text-gray-700 font-medium hover:text-green-600">Login</button>
            </SignInButton>

            {/* LOGIC FIX: SignUpButton should wrap the "SignUp" button */}
            <SignUpButton  mode="modal">
              <button className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition duration-300">
                SignUp
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                  elements: {
                      userButtonBox: "rounded-md!",
                      userButtonAvatarBox: "rounded-md! size-8!",
                      userButtonTrigger: "rounded-md!"
                  },
              }} 
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
