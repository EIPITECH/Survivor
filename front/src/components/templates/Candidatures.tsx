import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import croix from "../../assets/croix.png";
import poubelle from "../../assets/poubelle.png";
import verifier from "../../assets/verifier.png";

interface Job {
    id: number;
    title: string;
    description: string;
    cityName: string;
    streetNumber: number;
    streetName: string;
    zipCode: number;
    companyName: string;
    status: string;
}

interface Application {
    id: number;
    status: "submitted" | "accepted" | "rejected";
    message: string;
    createdAt: string;
    job: Job;
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

function getStatusLabel(status: Application["status"]) {
    switch (status) {
        case "accepted":
            return "Acceptée";

        case "rejected":
            return "Refusée";

        default:
            return "En attente";
    }
}


function Applications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getApplications() {
            const token = getToken();

            if (!token) {
                setError("Vous devez être connecté pour consulter vos candidatures");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/applications",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    console.error("Erreur récupération candidatures :", result);
                    setError(result.message ?? "Impossible de récupérer vos candidatures");
                    return;
                }
                console.log("Mes candidatures :", result);
                setApplications(result);

            } catch (fetchError) {
                console.error("Erreur lors du fetch des candidatures :", fetchError);
                setError("Une erreur est survenue lors de la récupération des candidatures");
            } finally {
                setLoading(false);
            }
        }
        getApplications();
    }, []);

    return (
        <div className="flex flex-col gap-6 bg-[#f7f8fb] px-5 py-8 sm:px-10">

            <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-black">
                    Espace candidat
                </p>

                <h1 className="mt-2 text-3xl font-bold text-[#FFA500]">
                    Mes candidatures
                </h1>
            </div>

            <section className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0_0_25px_rgba(0,0,0,0.1)]">

                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#FFA500]">
                        Candidatures ({applications.length})
                    </h2>
                </div>

                {loading && (
                    <p className="text-gray-500">
                        Chargement de vos candidatures...
                    </p>
                )}

                {!loading && error && (
                    <p className="text-red-500">
                        {error}
                    </p>
                )}

                {!loading && !error && applications.length === 0 && (
                    <p className="text-gray-500">
                        Vous n'avez encore candidaté à aucune offre.
                    </p>
                )}

                {!loading && !error && applications.map((application) => (
                        <div
                            key={application.id}
                            className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex gap-3">

                                <div className="border-l-2 border-[#FFA500]" />

                                <div>
                                    <h3 className="font-bold text-[#FFA500]">
                                        {application.job.title}
                                    </h3>

                                    <p className="text-gray-600">
                                        {application.job.companyName}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {application.job.cityName}
                                    </p>

                                    <p className="mt-2 text-sm">
                                        Statut :{" "}
                                        <span className="font-bold">
                                            {getStatusLabel(
                                                application.status
                                            )}
                                        </span>
                                    </p>
                                </div>

                            </div>

                            <div className="flex flex-col gap-1 text-sm text-gray-700 sm:items-end">

                                <span>
                                    Candidature envoyée le{" "}
                                    {new Intl.DateTimeFormat(
                                        "fr-FR"
                                    ).format(
                                        new Date(
                                            application.createdAt
                                        )
                                    )}
                                </span>

                                {application.message && (
                                    <span className="max-w-md text-gray-500">
                                        {application.message}
                                    </span>
                                )}

                            </div>

                        </div>
                    ))}

            </section>

        </div>
    );
}

export default Applications;