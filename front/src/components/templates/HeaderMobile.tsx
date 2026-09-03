import Button from "../buttons/Button";
import SwitchLocation from "../toggleSwitchLoc";
import LogoJeb from "../../assets/logoJEB.png";

function HeaderMobile() {
    return (
        <header className="w-full flex justify-between items-center px-4 py-2 bg-white shadow-md">
            <div className="flex items-center gap-2 min-w-0">
                <img className="size-12 shrink-0" src={LogoJeb.src} alt=""/>
                {/* <h1 className="text-black font-bold truncate">
                    GéoEmploi
                </h1> */}
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <SwitchLocation />
                <Button text="Connexion" clickable={true} link="/connexion/" role="Page de connexion" />
            </div>
        </header>
    );
}

export default HeaderMobile;