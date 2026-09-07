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

function CandidateApplicationModal({isOpen, setOpen, application}: 
{
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    application: Application | null;
}) {
    if (!isOpen || !application) {
        return null;
    }

    function getStatusLabel(status: Application["status"]) 
    {
        switch (status) {
            case "accepted":
                return "Acceptée";

            case "rejected":
                return "Refusée";

            default:
                return "En attente";
        }
    }

    const date = new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/25"
            onClick={() => setOpen(false)}
        >
            <div
                className="max-h-[85vh] w-150 max-w-[90vw] overflow-y-auto rounded-2xl bg-white px-10 py-8 shadow-[0_0_25px_rgba(0,0,0,0.15)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-col gap-6">

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#FFA500]">
                                {application.job.title}
                            </h1>

                            <p className="text-gray-500">
                                {application.job.companyName}
                            </p>
                        </div>

                        <button
                            className="cursor-pointer text-xl font-bold"
                            onClick={() => setOpen(false)}
                        >
                            ×
                        </button>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                        <h2 className="font-bold">
                            Localisation
                        </h2>

                        <p>
                            {application.job.streetNumber}{" "}
                            {application.job.streetName}
                        </p>

                        <p>
                            {application.job.zipCode}{" "}
                            {application.job.cityName}
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold">
                            Description de l'offre
                        </h2>

                        <p className="whitespace-pre-wrap">
                            {application.job.description}
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold">
                            Votre message
                        </h2>

                        <p className="whitespace-pre-wrap">
                            {application.message || "Aucun message."}
                        </p>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <p>
                            Statut :{" "}
                            <span className="font-bold">
                                {getStatusLabel(
                                    application.status
                                )}
                            </span>
                        </p>

                        <p>
                            Envoyée le{" "}
                            {date.format(new Date(application.createdAt))}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default CandidateApplicationModal;
