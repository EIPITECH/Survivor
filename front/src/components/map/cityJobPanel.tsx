import type { Job, CityGroup } from "../../types/job";

interface CityJobsPanelProps {
    group: CityGroup | null;
    onClose: () => void;
    onOpenJob: (job: Job) => void;
}
export default function CityJobsPanel({
    group,
    onClose,
    onOpenJob,
}: CityJobsPanelProps) {
    if (!group) {
        return null;
    }

    return (
        <aside
            className="
                absolute
                right-0
                top-0
                z-[1000]
                h-full
                w-[420px]
                max-w-[90vw]
                overflow-y-auto
                bg-white
                shadow-[-8px_0_25px_rgba(0,0,0,0.15)]
            "
        >
            <div className="flex flex-col gap-5 p-6">

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#FFA500]">
                            {group.cityName}
                        </h1>

                        <p className="text-gray-500">
                            {group.count} offre
                            {group.count > 1 ? "s" : ""} disponible
                            {group.count > 1 ? "s" : ""}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            cursor-pointer
                            text-2xl
                            font-bold
                            text-gray-600
                            hover:text-black
                        "
                    >
                        ×
                    </button>
                </div>

                <hr className="border-gray-200" />

                <div className="flex flex-col gap-4">

                    {group.jobs.map((job) => (
                        <button
                            key={job.id}
                            type="button"
                            onClick={() => onOpenJob(job)}
                            className="
                                cursor-pointer
                                rounded-xl
                                border
                                border-gray-200
                                p-4
                                text-left
                                transition
                                hover:border-[#FFA500]
                                hover:bg-orange-50
                            "
                        >
                            <h2 className="font-bold text-[#FFA500]">
                                {job.title}
                            </h2>

                            <p className="mt-1 font-semibold text-gray-700">
                                {job.companyName}
                            </p>

                            <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                                {job.description}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    {job.cityName}
                                </span>

                                <span className="font-semibold text-[#FFA500]">
                                    Voir l'offre →
                                </span>
                            </div>
                        </button>
                    ))}

                </div>

            </div>
        </aside>
    );
}
