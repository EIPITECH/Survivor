interface Application {
    id: number;
    status: "submitted" | "accepted" | "rejected";
    message: string;
    createdAt: string;

    job: {
        id: number;
        title: string;
        companyName: string;
        cityName: string;
    };

    seeker: {
        id: number;
        skills: string;
        experience: string;
        availability: string;

        user: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}

function DashboardApplicationModal({isOpen, setOpen, application}: 
{
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    application: Application | null;
}) 
{
    if (!isOpen || !application) {
        return null;
    }

    const handleClose = () => {
        setOpen(false);
    };

    const date = new Intl.DateTimeFormat("fr-FR", {day: "2-digit", month: "long", year: "numeric"});

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

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/25"
            onClick={handleClose}
        >
            <div
                className="max-h-[85vh] w-150 max-w-[90vw] overflow-y-auto rounded-2xl bg-white px-10 py-8 shadow-[0_0_25px_rgba(0,0,0,0.15)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-col gap-6">

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {application.seeker.user.firstName}{" "}
                                {application.seeker.user.lastName}
                            </h1>

                            <p className="text-gray-500">
                                {application.seeker.user.email}
                            </p>
                        </div>

                        <button
                            onClick={handleClose}
                            className="cursor-pointer text-xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                        <h2 className="font-bold">
                            Offre concernée
                        </h2>

                        <p>
                            {application.job.title}
                        </p>

                        <p className="text-sm text-gray-500">
                            {application.job.companyName} —{" "}
                            {application.job.cityName}
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold">
                            Compétences
                        </h2>

                        <p className="whitespace-pre-wrap">
                            {application.seeker.skills}
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold">
                            Expérience
                        </h2>

                        <p className="whitespace-pre-wrap">
                            {application.seeker.experience}
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold">
                            Disponibilité
                        </h2>

                        <p className="whitespace-pre-wrap">
                            {application.seeker.availability}
                        </p>
                    </div>

                    <div>
                        <h2 className="font-bold">
                            Message du candidat
                        </h2>

                        <p className="whitespace-pre-wrap">
                            {application.message || "Aucun message."}
                        </p>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex justify-between text-sm">
                        <p>
                            Statut :{" "}
                            <span className="font-bold">
                                {getStatusLabel(application.status)}
                            </span>
                        </p>

                        <p>
                            Candidature du{" "}
                            {date.format(
                                new Date(application.createdAt)
                            )}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DashboardApplicationModal;