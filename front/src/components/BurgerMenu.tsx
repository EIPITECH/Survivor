import Hamburger from 'hamburger-react';
import { useState } from 'react';
import Input from './buttons/Input';
import SliderLocalisation from './slider';

export default function BurgerMenu() {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-1001">
      <Hamburger size={30} toggled={isOpen} toggle={setOpen} />

      {isOpen && (
        <div className="absolute right-0 top-14 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 z-1001">
          <div className="mb-3 flex items-center justify-between">
          </div>

          <div className="space-y-3">
            <Input placeHolder="Localisation" />
            <SliderLocalisation />
            <Input placeHolder="Type d'emploi" />
          </div>
        </div>
      )}
    </div>
  );
}