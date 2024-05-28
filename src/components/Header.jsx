// Import necessary libraries and components
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/solid'

// Define the Header component
const Header = () => {
    // Define the links to be displayed in the header
    let Links =[
        {name:"HOME",link:"/"},
        {name:"ABOUT",link:"/src/components/About.jsx"},
        {name:"CONTACT",link:"./Contact.jsx"},
    ];

    // Define a state variable to control whether the menu is open or not
    let [open, setOpen] =useState(false);

    // Return the JSX to render
    return (
        <div className='shadow-md w-full fixed top-0 left-0'>
           <div className='md:flex items-center justify-between bg-white py-4 md:px-10 px-7'>
            {/* Logo section */}
            <div className='font-bold text-2xl cursor-pointer flex items-center gap-1'>
                <BookOpenIcon className='w-7 h-7 text-blue-600'/>
                <span>Radius</span>
            </div>
            {/* Menu icon, which toggles the 'open' state when clicked */}
            <div onClick={()=>setOpen(!open)} className='absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7'>
                {
                    open ? <XMarkIcon/> : <Bars3BottomRightIcon />
                }
            </div>
            {/* Link items, which are displayed based on the 'open' state */}
            <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-12' : 'top-[-490px]'}`}>
                {
                    Links.map((link) => (
                    <li className='md:ml-8 md:my-0 my-7 font-semibold'>
                        <a href={link.link} className='text-gray-800 hover:text-blue-400 duration-500'>{link.name}</a>
                    </li>))
                }
                {/* Register/Login button */}
                <button className='btn bg-blue-600 text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static'>Register/Login</button>
            </ul>
           </div>
        </div>
    );
};

// Export the Header component
export default Header;