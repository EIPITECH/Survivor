import { Modal } from "@mui/material";

function DashboardJobModal({
    isOpen,
    setOpen,
    job
}:{
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    job: any
}) {

    const handleClose = () => setOpen(false);
    const date = new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    const time = new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    if (!isOpen || !job) return null;

    return (
        <div className={`fixed inset-0 bg-black/25 z-50 flex items-center justify-center`}
            onClick={handleClose}>
                <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] px-16 py-8 w-125 max-w-[90vw] max-h-[85vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col">
                            <h1 className="font-bold text-xl">
                                {job.title}
                            </h1>
                            <p>
                                {job.description}
                            </p>
                        </div>
                        <div>
                            <p>{job.streetNumber} {job.streetName}</p>
                        </div>
                        <div className="flex flex-col justify-end mt-auto">
                            <div>Status: {job.status}</div>
                            <div>Score de confiance: {job.trustScore} / 1</div>
                            <div>Créé le: {date.format(new Date(job.createdAt))}</div>
                            <div>À: {time.format(new Date(job.createdAt))}</div>
                        </div>
                    </div>

                </div>
        </div>
    )
}

export default DashboardJobModal;