import Button from "../buttons/Button";
import SwitchLocation from "../toggleSwitchLoc";
import { useState } from "react";
import Cookies from "js-cookie";


type Props = {
    role: "seeker" | "employer" | "admin" | null;
    firstName: string | null;
};

function HeaderMobile({role, firstName}: Props) {
    const isConnected = role !== null;
    const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);

    let accountLink = "/profil/";

    if (role === "employer")
        accountLink = "/dashboard/";
    else if (role === "admin")
        accountLink = "/admin/";
    
    function logout() {
        Cookies.remove("token");
        window.location.href = "/";
    }

    return (
        <header className="w-full flex justify-between items-center px-4 py-2 bg-white shadow-md">
            <div className="flex items-center gap-2 min-w-0">
                {/* <h1 className="text-black font-bold truncate">
                    GéoEmploi
                </h1> */}
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <SwitchLocation />
                            
                {!isConnected ? (
                    <Button
                        text="Connexion"
                        clickable={true}
                        link="/connexion/"
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
                                text-[#1B3A6B]
                                rounded-xl
                                px-4
                                py-3
                                flex
                                items-center
                                gap-2
                                hover:bg-gray-300
                                cursor-pointer
                            "
                        >
                            {firstName ?? "Compte"}

                            <span
                                className={`
                                    text-xs
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
                                    w-48
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
                                        px-4
                                        py-3
                                        text-[#1B3A6B]
                                        hover:bg-gray-100
                                    "
                                >
                                    Mon compte
                                </a>

                                <button
                                    type="button"
                                    onClick={logout}
                                    className="
                                        block
                                        w-full
                                        px-4
                                        py-3
                                        text-left
                                        text-red-600
                                        hover:bg-gray-100
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
    );
}

export default HeaderMobile;