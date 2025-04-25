import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
export default function Header (){
  const {user} = useContext(UserContext);
  return (
    <div>
    <header className='flex justify-between'>
        <Link to={'/'} className="flex items-center gap-1">
        <img 
          src="/carro.svg" 
          alt="Logo" 
          className="size-8"  // Tailwind class for width and height of 2rem (32px)
        />
          <span className='font-bold text-xl'>AutoParts</span>
        </Link>
        
        <Link to={user?'/account':'/Login'} className='flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 hover:!bg-[#384ef5] hover:text-white transition-all duration-300'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            </div>
            {!!user && (
              <div>
                {user.name}
              </div>
            )}
        </Link>
      </header>
      </div>
  );
}