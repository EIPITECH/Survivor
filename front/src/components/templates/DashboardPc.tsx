
import poubelle from "../../assets/poubelle.png"
import croix from "../../assets/croix.png"
import verifier from "../../assets/verifier.png"

function DashboardPc() {
    return (
        <div className="flex flex-col gap-6 px-10 py-8">
            <div>
                <h1 className="text-2xl font-bold text-black">
                    Tableau de bord
                </h1>
            </div>

            {/* <div className="flex gap-4">
                <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex-1">
                </div>
                <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex-1">
                </div>
            </div> */}

            <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">

                <h1 className="text-xl font-bold text-black">
                    Candidatures (1)
                </h1>

                {/* 1 */}
                <div className="flex justify-between">
                    <div className="flex gap-2 px-5">
                        <div className="border border-[#1B3A6B]"></div>
                        <div>
                            <h1>
                                Développeur fullstack
                            </h1>
                            <p>
                                Jeanne Dupont
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <p>
                        voir la candidature ▾
                        </p>
                        <img className="size-5 shrink-0" src={verifier.src} alt=""/>
                        <img className="size-4 shrink-0" src={croix.src} alt=""/>
                        <img className="size-6 shrink-0 -translate-y-1" src={poubelle.src} alt=""/>
                    </div>
                </div>


            </div>

            <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">
                <h1 className="text-xl font-bold text-black">
                    Vos offres (2)
                </h1>

                {/* 1 */}
                <div className="flex justify-between">
                    <div className="flex gap-2 px-5">
                        <div className="border border-[#1B3A6B]"></div>
                        <div>
                            <h1>
                                Développeuse fullstack
                            </h1>
                            <p>
                                Nous recherchons un·e développeur·se fullstack pour rejoindre notre équipe technique et participer à la conception et à l'évolution de nos applications web, du back-end à l'interface utilisateur.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        Vues : <p className="font-bold px-2">4</p>
                    </div>
                </div>

                {/* 2 */}
                <div className="flex justify-between">
                    <div className="flex gap-2 px-5">
                        <div className="border border-[#1B3A6B]"></div>
                        <div>
                            <h1>
                                Analyste Sécurité Informatique
                            </h1>
                            <p>
                                Surveillance des systèmes d'information, détection et traitement des incidents de sécurité, veille sur les vulnérabilités. Expérience en SOC ou pentest appréciée, connaissances SIEM requises.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        Vues : <p className="font-bold px-2">18</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DashboardPc;