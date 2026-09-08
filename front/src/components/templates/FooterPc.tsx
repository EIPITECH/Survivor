import Button from "../buttons/Button";
import SwitchLocation from "../toggleSwitchLoc";

function FooterPc() {
    return (
        <footer className="mt-auto border-t-[3px] border-[#1B3A6B] px-10 py-2 bg-white items-center z-1000">
            <a className="flex justify-center text-[#1B3A6B] transition duration-100 text-xs">
                Démonstrateur technique, ne constitue pas un service public en exploitation.
                
                                 
            </a>
            <a className="group flex justify-center text-[#1B3A6B] transition duration-100 text-xs"
                href="/cgu/">
                    Conditions générales d'utilisation
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-150 h-px bg-[#1B3A6B]"></span>
            </a>
        </footer>
    )
}

export default FooterPc;
