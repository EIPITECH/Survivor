import { useState } from "react";
import Button from "../buttons/Button";

function PcTemplate() {

    const [profilPage, setProfilPage] = useState('profil');

    return (
        <div className="flex flex-col gap-10">
            <header className="w-full z-1000 flex justify-between px-10 py-2 bg-white items-center shadow-md">
                <div className="flex items-center gap-5">
                        <h1 className="flex justify-center font-bold text-xl">
                            GéoEmploi
                        </h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* <SwitchLocation /> */}
                    {/* <Button text="Mes candidatures" clickable={true}/> */}
                    {/* <Button text="Connexion" clickable={true} link="/connexion/"/> */}
                </div>
            </header>

            <div className="flex justify-start">
                <div className="flex flex-col gap-6">
                    <Button text="Profil" clickable={true} onClick={() => setProfilPage('profil')}/>
                    <Button text="Mes candidatures" clickable={true}/>
                </div>

                {profilPage == 'profil' &&
                    <div className="w-full flex flex-col gap-4">
                        <h1 className="font-bold text-2xl">
                            Mon profil
                        </h1>
                        <div>
                            Profil
                        </div>
                    </div>
                }
            </div>


        </div>
    )
}

export default PcTemplate;