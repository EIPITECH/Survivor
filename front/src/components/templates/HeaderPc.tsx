import Button from "../buttons/Button";
import SwitchLocation from "../toggleSwitchLoc";
import { useState } from "react";
import CreateOfferModal from "../modal/createJobModal"; 
import Cookies from "js-cookie";
import Candidatures from "../../pages/Candidatures.astro";

type Props = {
    role: "seeker" | "employer" | "admin" | null;
    firstName: string | null;
};

function HeaderPc({ role, firstName }: Props) {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
    const isConnected = role !== null;
    const isEmployer = role === "employer";
    const isSeeker = role === "seeker";
    let accountLink = "/seekerDashboard";



    if (role === "employer")
        accountLink = "/dashboard/";
    else if (role === "admin")
        accountLink = "/pannel-admin/";

    function logout() {
        Cookies.remove("token");
        window.location.href = "/";
    }

    function Applications() {
        window.location.href = "/Candidatures";
    }

    return (
        <>
            <header className="w-full z-1000 flex justify-between px-10 py-2 bg-white items-center shadow-md">
                <div className="flex items-center gap-5">
                <h1 className="text-black font-bold">
                    GéoEmploi
                </h1>
                </div>

                <div className="flex items-center gap-4">

                    <SwitchLocation />
                    <Button
                            text="Transparence"
                            clickable={true}
                            link="/transparence"
                            role="Page transparence"
                        />

                    {isEmployer && (
                        <Button
                            text="Créer une offre"
                            clickable={true}
                            type="button"
                            onClick={() => setCreateModalOpen(true)}
                        />
                    )}

                    {!isConnected ? (
                        <Button
                            text="Connexion"
                            clickable={true}
                            link="/connexion"
                            role="Page de connexion"
                        />
                    ) : (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setAccountMenuOpen(!isAccountMenuOpen)
                                }
                                className="
                                    bg-gray-200
                                    text-[#FFA500]
                                    rounded-xl
                                    px-6
                                    py-4
                                    text-xl
                                    flex
                                    items-center
                                    gap-2
                                    hover:cursor-pointer
                                    hover:bg-gray-300   
                                    transition-colors
                                "
                            >
                                {firstName ?? "Mon compte"}

                                <span
                                    className={`
                                        text-sm
                                        transition-transform
                                        duration-200
                                        ${isAccountMenuOpen ? "rotate-180" : ""}
                                    `}
                                >
                                    ▼
                                </span>
                            </button>

                            {isAccountMenuOpen && (
                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-full
                                        mt-2
                                        w-52
                                        bg-white
                                        rounded-xl
                                        shadow-lg
                                        border
                                        border-gray-200
                                        overflow-hidden
                                        z-[2000]
                                    "
                                >
                                    <a
                                        href={accountLink}
                                        className="
                                            block
                                            w-full
                                            px-5
                                            py-4
                                            text-left
                                            text-black
                                            hover:bg-[#FFA500]/50
                                            transition-colors
                                            z-index:10000
                                        "
                                    >
                                        Mon compte
                                    </a>

                                    {isSeeker && (
                                        <button
                                        type="button"
                                        onClick={Applications}
                                        className="
                                            block
                                            w-full
                                            px-5
                                            py-4
                                            text-left
                                            text-black
                                            hover:bg-[#FFA500]/50
                                            transition-colors
                                            cursor-pointer
                                        "
                                    >
                                        Mes candidatures
                                    </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="
                                            block
                                            w-full
                                            px-5
                                            py-4
                                            text-left
                                            text-red-600
                                            hover:bg-[#FFA500]/50
                                            transition-colors
                                            cursor-pointer
                                        "
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>
            {isEmployer && (
                <CreateOfferModal
                    isOpen={isCreateModalOpen}
                    setOpen={setCreateModalOpen}
                />
            )}
        </>
    )
}

export default HeaderPc;