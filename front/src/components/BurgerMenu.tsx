import Hamburger from 'hamburger-react';
import { useState } from 'react';

export default function BurgerMenu() {
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
            <Hamburger size={30} toggled={isOpen} toggle={setOpen}/>
            {isOpen &&
                <div  style={{zIndex: '100'}} className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-48" >
                  <ul>
                    <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer;">Home</li>
                    <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer;">About</li>
                    <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer;">Contact</li>
                  </ul>
                  
                </div>
                }
    </div>
);
}