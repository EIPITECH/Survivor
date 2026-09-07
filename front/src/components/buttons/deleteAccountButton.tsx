import { useState } from "react";
import Cookies from "js-cookie";

function DeleteAccountButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function deleteAccount() {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible");

        if (!confirmed) {
            return;
        }

        const tokenCookie = Cookies.get("token");

        if (!tokenCookie) {
            setError("Vous devez être connecté.");
            return;
        }

        let token = tokenCookie;

        try {
            const parsedToken = JSON.parse(tokenCookie);
            token = parsedToken.accessToken ?? tokenCookie;
        } catch {
            token = tokenCookie;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                "http://localhost:3000/users/me",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setError(result.message ?? "Impossible de supprimer le compte");
                return;
            }
            Cookies.remove("token");
            window.location.href = "/";
        } catch (fetchError) {
            console.error("Erreur suppression du compte :", fetchError);
            setError("Une erreur est survenue lors de la suppression");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={deleteAccount}
                disabled={loading}
                className="
                    w-fit
                    cursor-pointer
                    rounded-lg
                    bg-red-600
                    px-5
                    py-3
                    font-bold
                    text-white
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                {loading
                    ? "Suppression..."
                    : "Supprimer mon compte"}
            </button>

            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

export default DeleteAccountButton;