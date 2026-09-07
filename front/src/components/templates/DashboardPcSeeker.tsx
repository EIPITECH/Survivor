import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import croix from "../../assets/croix.png";
import poubelle from "../../assets/poubelle.png";
import verifier from "../../assets/verifier.png";
import DeleteAccountButton from "../buttons/deleteAccountButton";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}

function getToken(): string | null {
    const tokenCookie = Cookies.get("token");

    if (!tokenCookie) {
        return null;
    }

    try {
        const parsedToken = JSON.parse(tokenCookie);
        return parsedToken.accessToken ?? tokenCookie;
    } catch {
        return tokenCookie;
    }
}

function getUserId(token: string): number | null {
    try {
        const payloadPart = token.split(".")[1];
        const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        return Number(payload.userId ?? payload.sub) || null;
    } catch {
        return null;
    }
}

function DashboardPcSeeker() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function getPersonalInfo() {
            const token = getToken();
            const userId = token ? getUserId(token) : null;

            try {
                const response = await fetch(`http://localhost:3000/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("La récupération du profil a échoué.");
                }

                setUser(await response.json());
            } catch (fetchError) {
                console.error("Erreur lors de la récupération du profil :", fetchError);
            }
        }

        getPersonalInfo();
    }, []);

   

    return (
        <div className="flex flex-col gap-6 bg-[#f7f8fb] px-5 py-8 sm:px-10">
            <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-black">Espace candidat</p>
                <h1 className="mt-2 text-3xl font-bold text-[#FFA500]">Mon profil</h1>
            </div>

            <section className="rounded-2xl bg-white p-6 shadow-[0_0_25px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-2 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#FFA500]">Informations personnelles</h2>
                        <p className="mt-1 text-gray-600">Ces informations sont associées à votre compte candidat.</p>
                    </div>
                </div>

                {user  && (
                    <div className="grid gap-5 pt-6 sm:grid-cols-2">
                        <ProfileField  label="Prénom" value={user.firstName} />
                        <ProfileField label="Nom" value={user.lastName} />
                        <ProfileField label="Adresse e-mail" value={user.email} />
                        <ProfileField label="Type de compte" value="Candidat" />
                    </div>
                )}
            </section>
            <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-[0_0_25px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-red-600">
                            Supprimer mon compte
                        </h2>
                        <p className="mt-1 text-gray-600">
                            La suppression de votre compte est définitive.
                            Vos informations et vos candidatures seront supprimées.
                        </p>
                    </div>
                    <DeleteAccountButton />
                </div>
            </section>
        </div>
    );
}

function ProfileField({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-gray-200 px-4 py-3">
            <p className="text-sm text-[#FFA500]">{label}</p>
            <p className="mt-1 font-bold text-black">{value}</p>
        </div>
    );
}

export default DashboardPcSeeker;