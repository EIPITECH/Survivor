import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import croix from "../../assets/croix.png";
import poubelle from "../../assets/poubelle.png";
import verifier from "../../assets/verifier.png";
import DeleteAccountButton from "../buttons/deleteAccountButton";
import DownloadExportButton from "../buttons/downloadExportButton";
import { LocationModal } from "../toggleSwitchLoc";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}


interface SeekerProfile {
    id: number;
    skills: string;
    experience: string;
    availability: string;
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
    const [seekerProfile, setSeekerProfile] = useState<SeekerProfile | null>(null);
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("");
    const [availability, setAvailability] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");
    const [locationInfoOpen, setLocationInfoOpen] = useState(false);

    useEffect(() => {
        async function getPersonalInfo() {
            const token = getToken();
            const userId = token ? getUserId(token) : null;

            try {
                const [userResponse, seekerResponse] = await Promise.all([
                    fetch(`http://localhost:3000/users/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }),
                    fetch("http://localhost:3000/seekers/me", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }),
                ]);
                if (!userResponse.ok) {
                    throw new Error("La récupération du profil utilisateur a échoué.");
                }

                if (!seekerResponse.ok) {
                    throw new Error("La récupération du profil candidat a échoué.");
                }

                const userData: User = await userResponse.json();
                const seekerData: SeekerProfile = await seekerResponse.json();

                setUser(userData);
                setSeekerProfile(seekerData);
                setSkills(seekerData.skills ?? "");
                setExperience(seekerData.experience ?? "");
                setAvailability(seekerData.availability ?? "");

            } catch (fetchError) {
                console.error("Erreur lors de la récupération du profil :", fetchError);
                setProfileError("Impossible de récupérer votre profil candidat.");
            }
        }

        getPersonalInfo();
    }, []);

    function cancelEdit() 
    {
        if (!seekerProfile) {
            return;
        }

        setSkills(seekerProfile.skills ?? "");
        setExperience(seekerProfile.experience ?? "");
        setAvailability(seekerProfile.availability ?? "");
        setProfileError("");
        setProfileSuccess("");
        setIsEditing(false);
    }
    async function updateProfessionalProfile() {
        const token = getToken();

        if (!token) {
            setProfileError("Vous devez être connecté pour modifier votre profil.");
            return;
        }

        if (!skills.trim() || !experience.trim() || !availability.trim()) {
            setProfileError("Tous les champs du profil professionnel doivent être renseignés.");
            return;
        }

        setIsSaving(true);
        setProfileError("");
        setProfileSuccess("");

        try {
            const response = await fetch("http://localhost:3000/seekers/me", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    skills: skills.trim(),
                    experience: experience.trim(),
                    availability: availability.trim(),
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.message ?? "La modification du profil a échoué.");
            }

            const updatedProfile: SeekerProfile = data;

            setSeekerProfile(updatedProfile);
            setSkills(updatedProfile.skills ?? "");
            setExperience(updatedProfile.experience ?? "");
            setAvailability(updatedProfile.availability ?? "");
            setProfileSuccess("Votre profil professionnel a bien été mis à jour.");
            setIsEditing(false);
        } catch (error) {
            setProfileError(
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue pendant la modification du profil.",
            );
        } finally {
            setIsSaving(false);
        }
    }
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

                {user && (
                    <div className="grid gap-5 pt-6 sm:grid-cols-2">
                        <ProfileField label="Prénom" value={user.firstName} />
                        <ProfileField label="Nom" value={user.lastName} />
                        <ProfileField label="Adresse e-mail" value={user.email} />
                        <ProfileField label="Type de compte" value="Candidat" />
                    </div>
                )}
            </section>

            <section className="rounded-2xl bg-white p-6 shadow-[0_0_25px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#FFA500]">Profil professionnel</h2>
                        <p className="mt-1 text-gray-600">
                            Gérez les informations transmises aux employeurs lorsque vous candidatez.
                        </p>
                    </div>

                    {!isEditing && seekerProfile && (
                        <button
                            type="button"
                            onClick={() => {
                                setProfileError("");
                                setProfileSuccess("");
                                setIsEditing(true);
                            }}
                            className="w-fit cursor-pointer rounded-lg bg-[#FFA500] px-5 py-3 font-semibold text-black transition hover:bg-[#FFA500]/70"
                        >
                            Modifier mon profil
                        </button>
                    )}
                </div>

                {profileError && (
                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {profileError}
                    </div>
                )}

                {profileSuccess && (
                    <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        {profileSuccess}
                    </div>
                )}

                {seekerProfile && !isEditing && (
                    <div className="grid gap-5 pt-6">
                        <ProfessionalProfileField label="Compétences" value={seekerProfile.skills} />
                        <ProfessionalProfileField label="Expérience" value={seekerProfile.experience} />
                        <ProfessionalProfileField label="Disponibilité" value={seekerProfile.availability} />
                    </div>
                )}

                {seekerProfile && isEditing && (
                    <div className="flex flex-col gap-5 pt-6">
                        <EditableField
                            label="Compétences"
                            value={skills}
                            onChange={setSkills}
                            placeholder="Ex : C, C++, Docker, Node.js"
                        />

                        <EditableField
                            label="Expérience"
                            value={experience}
                            onChange={setExperience}
                            placeholder="Décrivez vos expériences professionnelles ou vos projets."
                            multiline
                        />

                        <EditableField
                            label="Disponibilité"
                            value={availability}
                            onChange={setAvailability}
                            placeholder="Ex : Immédiatement, à partir du 1er octobre..."
                        />

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={isSaving}
                                className="cursor-pointer rounded-lg border border-gray-300 px-5 py-3 font-semibold text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Annuler
                            </button>

                            <button
                                type="button"
                                onClick={updateProfessionalProfile}
                                disabled={isSaving}
                                className="cursor-pointer rounded-lg bg-[#FFA500] px-5 py-3 font-semibold text-black transition hover:bg-[#FFA500]/70 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
                            </button>
                        </div>
                    </div>
                )}
            </section>

            <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-[0_0_25px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-black">Géolocalisation</h3>

                        <p className="text-gray-600">
                            Consultez les informations relatives à l'utilisation de votre localisation par GéoEmploi.
                        </p>

                        <button
                            type="button"
                            onClick={() => setLocationInfoOpen(true)}
                            className="w-fit cursor-pointer rounded-lg bg-[#FFA500] px-5 py-3 font-semibold text-black hover:bg-[#FFA500]/50"
                        >
                            Informations sur la géolocalisation
                        </button>
                    </div>

                    <LocationModal
                        isOpen={locationInfoOpen}
                        onClose={() => setLocationInfoOpen(false)}
                        informationOnly
                    />

                    <div>
                        <h2 className="text-xl font-bold text-black">Mes données personnelles</h2>
                        <p className="mt-1 text-black">
                            Téléchargez une copie des données personnelles que GéoEmploi détient à votre sujet.
                        </p>
                    </div>
                    <DownloadExportButton />

                    <div>
                        <h2 className="text-xl font-bold text-red-600">Supprimer mon compte</h2>
                        <p className="mt-1 text-gray-600">
                            La suppression de votre compte est définitive. Vos informations et vos candidatures seront supprimées.
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

function ProfessionalProfileField({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-gray-200 px-4 py-4">
            <p className="text-sm font-semibold text-[#FFA500]">{label}</p>
            <p className="mt-2 whitespace-pre-wrap text-black">{value || "Non renseigné"}</p>
        </div>
    );
}

function EditableField({
    label,
    value,
    onChange,
    placeholder,
    multiline = false,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    multiline?: boolean;
}) {
    return (
        <label className="flex flex-col gap-2">
            <span className="font-semibold text-black">{label}</span>

            {multiline ? (
                <textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    rows={5}
                    className="resize-y rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500]/20"
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-black outline-none transition focus:border-[#FFA500] focus:ring-2 focus:ring-[#FFA500]/20"
                />
            )}
        </label>
    );
}

export default DashboardPcSeeker;