import { useState } from "react";
import Cookies from "js-cookie";

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

function getRoleLabel(role: User["role"]) {
    switch (role) {
        case "seeker":
            return "Demandeur d'emploi";

        case "employer":
            return "Employeur";

        case "admin":
            return "Administrateur";

        default:
            return role;
    }
}

function DashboardUserModal({
    isOpen,
    setOpen,
    user,
    onUserUpdated,
}: {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    onUserUpdated?: (user: User) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !user) {
        return null;
    }

    const isSuspended = user.accountStatus === "suspended";

    const handleClose = () => {
        if (loading) {
            return;
        }

        setError("");
        setOpen(false);
    };

    async function updateAccountStatus(status: "active" | "suspended") 
    {
        const token = getToken();

        if (!token) {
            setError("Token administrateur introuvable");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`http://localhost:3000/users/${user.id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(
                    Array.isArray(result.message)
                        ? result.message.join(", ")
                        : result.message ||
                          "Impossible de modifier le statut du compte."
                );
            }
            onUserUpdated?.(result);
            setOpen(false);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "Une erreur est survenue."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/30
            "
            onClick={handleClose}
        >
            <div
                className="
                    w-[500px]
                    max-w-[90vw]
                    rounded-2xl
                    bg-white
                    p-8
                    shadow-[0_0_25px_rgba(0,0,0,0.15)]
                "
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                {/* HEADER */}
                <div
                    className="
                        flex
                        items-start
                        justify-between
                    "
                >
                    <div>
                        <h1
                            className="
                                text-2xl
                                font-bold
                                text-black
                            "
                        >
                            {user.firstName}{" "}
                            {user.lastName}
                        </h1>

                        <p
                            className="
                                mt-1
                                text-gray-500
                            "
                        >
                            {getRoleLabel(user.role)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            text-2xl
                            font-bold
                            text-gray-400
                            hover:cursor-pointer
                            hover:text-black
                        "
                    >
                        ×
                    </button>
                </div>

                <div
                    className="
                        my-6
                        h-px
                        bg-gray-200
                    "
                />

                {/* INFORMATIONS */}
                <div className="flex flex-col gap-4">

                    <div>
                        <p
                            className="
                                text-sm
                                text-gray-500
                            "
                        >
                            Adresse email
                        </p>

                        <p className="font-semibold">
                            {user.email}
                        </p>
                    </div>

                    <div>
                        <p
                            className="
                                text-sm
                                text-gray-500
                            "
                        >
                            Rôle
                        </p>

                        <p className="font-semibold">
                            {getRoleLabel(user.role)}
                        </p>
                    </div>

                    <div>
                        <p
                            className="
                                text-sm
                                text-gray-500
                            "
                        >
                            Création du compte
                        </p>

                        <p className="font-semibold">
                            {new Date(
                                user.createdAt
                            ).toLocaleDateString(
                                "fr-FR"
                            )}
                        </p>
                    </div>

                    {/* STATUT */}
                    <div>
                        <p
                            className="
                                mb-2
                                text-sm
                                text-gray-500
                            "
                        >
                            Statut du compte
                        </p>

                        {isSuspended ? (
                            <div
                                className="
                                    flex
                                    w-fit
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-red-100
                                    px-3
                                    py-2
                                "
                            >
                                <div
                                    className="
                                        size-2
                                        rounded-full
                                        bg-red-600
                                    "
                                />

                                <p
                                    className="
                                        font-bold
                                        text-red-700
                                    "
                                >
                                    Suspendu
                                </p>
                            </div>
                        ) : (
                            <div
                                className="
                                    flex
                                    w-fit
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-green-100
                                    px-3
                                    py-2
                                "
                            >
                                <div
                                    className="
                                        size-2
                                        rounded-full
                                        bg-green-600
                                    "
                                />

                                <p
                                    className="
                                        font-bold
                                        text-green-700
                                    "
                                >
                                    Actif
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ERREUR */}
                {error && (
                    <div
                        className="
                            mt-5
                            rounded-lg
                            bg-red-100
                            px-4
                            py-3
                            text-sm
                            text-red-700
                        "
                    >
                        {error}
                    </div>
                )}

                <div
                    className="
                        mt-8
                        flex
                        justify-end
                        gap-3
                    "
                >
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleClose}
                        className="
                            rounded-lg
                            bg-gray-100
                            px-4
                            py-3
                            font-semibold
                            text-black
                            hover:cursor-pointer
                            hover:bg-gray-200
                            disabled:opacity-50
                        "
                    >
                        Fermer
                    </button>

                    {isSuspended ? (
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                updateAccountStatus(
                                    "active"
                                )
                            }
                            className="
                                rounded-lg
                                bg-green-600
                                px-4
                                py-3
                                font-semibold
                                text-white
                                hover:cursor-pointer
                                hover:bg-green-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Réactivation..."
                                : "Réactiver le compte"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                updateAccountStatus(
                                    "suspended"
                                )
                            }
                            className="
                                rounded-lg
                                bg-red-600
                                px-4
                                py-3
                                font-semibold
                                text-white
                                hover:cursor-pointer
                                hover:bg-red-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Suspension..."
                                : "Suspendre le compte"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardUserModal;
