import Button from "../buttons/Button";
import SwitchLocation from "../toggleSwitchLoc";
import { useState } from "react";
import LogoJeb from "../../assets/logoJEB.png"
import CreateOfferModal from "../modal/createJobModal"; 

type Props = {
    role: "seeker" | "employer" | "admin" | null;
};

function HeaderPc({ role }: Props) {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const isConnected = role !== null;
    const isEmployer = role === "employer";

    return (
        <>
            <header className="w-full z-1000 flex justify-between px-10 py-2 bg-white items-center shadow-md">
                <div className="flex items-center gap-5">
                    <img className="size-20" src={LogoJeb.src} alt=""/>
                <h1 className="text-black font-bold">
                    GéoEmploi
                </h1>
                </div>

                <div className="flex items-center gap-4">
                    <SwitchLocation />

                    {isEmployer && (
                        <Button
                            text="Créer une offre"
                            clickable={true}
                            type="button"
                            onClick={() => setCreateModalOpen(true)}
                        />
                    )}

                    {isConnected ? (
                        <Button
                            text="Mon compte"
                            clickable={true}
                            link="/profil/"
                            role="Accéder à mon compte"
                        />
                    ) : (
                        <Button
                            text="Connexion"
                            clickable={true}
                            link="/connexion/"
                            role="Page de connexion"
                        />
                    )}
                </div>
            </header>
            <CreateOfferModal
                isOpen={isCreateModalOpen}
                setOpen={setCreateModalOpen}
            />
        </>
    )
}

export default HeaderPc;