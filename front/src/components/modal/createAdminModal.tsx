import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Input from "../buttons/Input";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    isConnected: boolean;
    role: "seeker" | "employer" | "admin";
    accountStatus: "active" | "suspended";
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

function CreateAdminModal({isOpen, setOpen, onAdminCreated}: 
{
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAdminCreated: (admin: User) => void;
}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setError("");
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleClose = () => {
        if (loading) {
            return;
        }
        setError("");
        setOpen(false);
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
            setError("Tous les champs sont obligatoires.");
            return;
        }

        if (password.length < 11) {
            setError("Le mot de passe doit contenir au moins 11 caractères");
            return;
        }
        const token = getToken();
        if (!token) {
            setError("Token administrateur introuvable.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:3000/users/admin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        email: email.trim(),
                        password,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(Array.isArray(result.message) ? result.message.join(", ") : result.message || "Impossible de créer le compte administrateur");
            }
            onAdminCreated(result);
            setOpen(false);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Une erreur est survenue.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            onClick={handleClose}
        >
            <div
                className="w-[540px] max-w-[90vw] rounded-2xl bg-white p-8 shadow-[0_0_25px_rgba(0,0,0,0.15)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-black">
                            Créer un compte administrateur
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Ce compte aura accès au panel d'administration.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="text-2xl font-bold text-gray-400 hover:cursor-pointer hover:text-black disabled:cursor-not-allowed"
                        aria-label="Fermer la fenêtre"
                    >
                        ×
                    </button>
                </div>

                <div className="my-6 h-px bg-gray-200" />

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-[#FFA500]">
                                Prénom*
                            </label>

                            <Input
                                placeHolder="Jean"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(event.target.value)
                                }
                                classInput="w-full"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-[#FFA500]">
                                Nom*
                            </label>

                            <Input
                                placeHolder="Dupont"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(event.target.value)
                                }
                                classInput="w-full"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-[#FFA500]">
                            Email*
                        </label>

                        <Input
                            type="email"
                            placeHolder="admin@geoemploi.fr"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            classInput="w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-[#FFA500]">
                            Mot de passe*
                        </label>

                        <Input
                            type="password"
                            placeHolder="11 caractères minimum"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            classInput="w-full"
                        />

                        <p className="text-xs text-gray-500">
                            Le mot de passe doit contenir au moins 11
                            caractères.
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="mt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-xl border-2 border-gray-300 px-5 py-3 font-bold text-gray-700 transition hover:cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-[#FFA500] px-5 py-3 font-bold text-black transition hover:cursor-pointer hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Création..."
                                : "Créer le compte"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateAdminModal;
