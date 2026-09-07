import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import croix from "../../assets/croix.png";
import poubelle from "../../assets/poubelle.png";
import verifier from "../../assets/verifier.png";


function Applications() {
   

    return (
        <div className="flex flex-col gap-6 bg-[#f7f8fb] px-5 py-8 sm:px-10">
            <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-black">Espace candidat</p>
                <h1 className="mt-2 text-3xl font-bold text-[#FFA500]">Mon profil</h1>
            </div>

            <section className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_0_25px_rgba(0,0,0,0.1)]">
                <h2 className="text-xl font-bold text-[#FFA500]">Candidature</h2>
                <div className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                        <div className="border-l-2 border-[#FFA500]" />
                        <div>
                            <h3 className="font-bold text-[#FFA500]">Développeur fullstack</h3>
                            <p className="text-gray-600">Jeanne Dupont</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-700">
                        <span>Voir la candidature</span>
                    </div>
                </div>
            </section>

        </div>
    );
}


export default Applications;