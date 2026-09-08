import { useState } from "react";
import Cookies from "js-cookie";

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

export default function DownloadExportButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const downloadData = async () => {
        const token = getToken();

        if (!token) {
            setError("Vous devez être connecté.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                "http://localhost:3000/users/me/export",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const result = await response.json();
                setError(result.message ?? "Impossible de récupérer vos données");
                return;
            }
            const data = await response.json();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob(
                [json],
                {
                    type: "application/json",
                }
            );
            const url =
                URL.createObjectURL(blob);
            const link =
                document.createElement("a");
            link.href = url;
            link.download = "geoemploi-mes-donnees.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erreur export données personnelles :", error);
            setError("Une erreur est survenue lors de l'export");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col gap-2">

            <button
                type="button"
                onClick={downloadData}
                disabled={loading}
                className="
                    w-fit
                    cursor-pointer
                    rounded-lg
                    bg-[#FFA500]
                    px-5
                    py-3
                    font-bold
                    text-black
                    hover:opacity-90
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    hover:bg-[#FFA500]/50
                "
            >
                {loading
                    ? "Préparation..."
                    : "Télécharger mes données"}
            </button>

            {error && (
                <p className="text-sm text-red-600">
                    {error}
                </p>
            )}

        </div>
    );
}
