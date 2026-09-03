import Button from "../buttons/Button";
import SwitchLocation from "../toggleSwitchLoc";
import logoJeb from "../../assets/logoJEB.svg"
import { useState } from "react";
import LogoJeb from "../../assets/logoJEB.png"
import CreateOfferModal from "../modal/createJobModal"; 

function HeaderPc() {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    return (
        <>
            <header className="w-full z-1000 flex justify-between px-10 py-2 bg-white items-center shadow-md">
                <div className="flex items-center gap-5">
                    <img className="size-20" src={LogoJeb.src} alt="Logo JEB"/>
                <h1 className="text-black font-bold">
                    GéoEmploi
                </h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <SwitchLocation />
                    <Button 
                        text="Créer une offre" 
                        clickable={true} 
                        type="button" 
                        onClick={() => setCreateModalOpen(true)} 
                    />
                    <Button text="Connexion" clickable={true} link="/connexion/"/>
                </div>
            </header>
            <CreateOfferModal isOpen={isCreateModalOpen} setOpen={setCreateModalOpen} />
        </>
    )
}

export default HeaderPc;