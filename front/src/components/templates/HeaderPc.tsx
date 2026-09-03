import Button from "../buttons/Button";
import SwitchLocation from "../toggleSwitchLoc";
import logoJeb from "../../assets/logoJEB.png"
import LogoJeb from "../../assets/logoJEB.svg"

function HeaderPc() {

    return (
        <header className="w-full z-1000 flex justify-between px-10 py-2 bg-white items-center shadow-md">
            <div className="flex items-center gap-5">
                <img className="size-20" src={logoJeb.src} alt=""/>
                <h1 className="text-black font-bold">
                    GéoEmploi
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <SwitchLocation />
                {/* <Button text="Mes candidatures" clickable={true}/> */}
                <Button text="Connexion" clickable={true} link="/connexion/"/>
            </div>
        </header>
    )
}

export default HeaderPc;
