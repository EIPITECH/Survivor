
import croix from "../../assets/croix.png"
import verifier from "../../assets/verifier.png"
import { useEffect, useState } from "react";
import DashboardJobModal from "../modal/DashboardJobModal";
import Cookies from 'js-cookie'
import DashboardApplicationModal from "../modal/dashboardApplicationModal";
import DownloadExportButton from "../buttons/downloadExportButton";
import DeleteAccountButton from "../buttons/deleteAccountButton";
import { LocationModal } from "../toggleSwitchLoc";
import EmployerNotifications from "../employerNotifs";


interface Job {
    id: number;
    title: string;
    description: string;
    cityName: string,
    streetNumber: number,
    streetName: string,
    zipCode: number,
    latitude: number,
    longitude: number,
    employerId: number,
    status: string,
    geocodageSource: string,
    trustScore: number,
    obtentionDate: string,
    views: number,
    createdAt: string
}

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

function DashboardPc() {

    
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [applicationOpen, setApplicationOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [applicationDateSort, setApplicationDateSort] = useState<"desc" | "asc">("desc");
    const [applicationJobFilter, setApplicationJobFilter] = useState<string>("all");
    const [applicationStatusFilter, setApplicationStatusFilter] = useState<"all" | "submitted" | "accepted" | "rejected">("all");
    const [applicationSearch, setApplicationSearch] = useState<string>("");

    const [open, setOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const okJob = ['active'];
    const toCheckJob = ['toCheck'];
    const archiveJob = ['archived']
    const lengthOkJob = jobs.filter(job => job.status.includes('active')).length;
    const lengthtoCheckJob = jobs.filter(job => job.status.includes('toCheck')).length;
    const lengthArchiveJob = jobs.filter(job => job.status.includes('archived')).length;

    const handleApplicationSelection = (application: Application) => {
        setSelectedApplication(application);
        setApplicationOpen(true);
    };
    const [locationInfoOpen, setLocationInfoOpen] = useState(false);

    useEffect(() => {
        async function getMyJobs() {
            const token = getToken();

            if (!token) {
                console.error("Aucun token employeur trouvé");
                return;
            }
            try {
                const response = await fetch(
                    "http://localhost:3000/jobs/mine",
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
                    console.error("Erreur lors de la récupération des offres :", result);
                    return;
                }
                console.log("Mes offres employeur :", result);
                setJobs(result);

            } catch (error) {
                console.error("Erreur lors du fetch des offres :", error);
            }
        }
        getMyJobs();
    }, []);

    useEffect(() => {
        async function getApplications() {
            const token = getToken();

            if (!token) {
                console.error("Aucun token employeur trouvé");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:3000/applications/employer",
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
                    console.error(
                        "Erreur récupération candidatures :",
                        result
                    );
                    return;
                }

                console.log("Candidatures reçues :", result);
                setApplications(result);

            } catch (error) {
                console.error(
                    "Erreur lors du fetch des candidatures :",
                    error
                );
            }
        }

        getApplications();
    }, []);

    async function updateApplicationStatus(applicationId: number, status: "accepted" | "rejected") 
    {
        const token = getToken();

        if (!token) {
            console.error("Aucun token employeur trouvé");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/applications/${applicationId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: status,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                console.error("Erreur modification candidature :", result);
                return;
            }

            console.log("Statut candidature modifié :", result);

            setApplications((previousApplications) =>
                previousApplications.map((application) =>
                    application.id === applicationId
                        ? {
                            ...application,
                            status: status,
                        }
                        : application
                )
            );

        } catch (error) {
            console.error("Erreur lors de la modification du statut :", error);
        }
    }

    const handleJobSelection = (job: Job) => {
        setSelectedJob(job);
        setOpen(true);
    }
const filteredApplications = applications
    .filter((application) => {
        if (
            applicationStatusFilter !== "all" &&
            application.status !== applicationStatusFilter
        ) {
            return false;
        }

        if (
            applicationJobFilter !== "all" &&
            application.job.id.toString() !== applicationJobFilter
        ) {
            return false;
        }

        if (applicationSearch.trim() !== "") {
            const search = applicationSearch.toLowerCase();

            const firstName =
                application.seeker.user.firstName.toLowerCase();

            const lastName =
                application.seeker.user.lastName.toLowerCase();

            const email =
                application.seeker.user.email.toLowerCase();

            const jobTitle =
                application.job.title.toLowerCase();

            if (
                !firstName.includes(search) &&
                !lastName.includes(search) &&
                !email.includes(search) &&
                !jobTitle.includes(search)
            ) {
                return false;
            }
        }

        return true;
    })
    .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return applicationDateSort === "desc"
            ? dateB - dateA
            : dateA - dateB;
    });

    const formatApplicationDate = (createdAt: string) =>
        new Date(createdAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        return (
        <div className="flex flex-col gap-6 px-10 py-8">
            <div>
                <h1 className="text-2xl font-bold text-black">
                    Tableau de bord
                </h1>
            </div>
            <EmployerNotifications variant="dashboard" />
            {/* <div className="flex gap-4">
                <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex-1">
                </div>
                <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex-1">
                </div>
            </div> */}

            <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">

                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-xl font-bold text-black">
                            Candidatures ({filteredApplications.length})
                        </h1>
                    </div>
                            
                    <div className="flex flex-wrap gap-3">
                            
                        {/* Recherche */}
                        <input
                            type="text"
                            value={applicationSearch}
                            onChange={(e) => setApplicationSearch(e.target.value)}
                            placeholder="Rechercher candidat ou offre..."
                            className="
                                min-w-[220px]
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-black
                                outline-none
                                focus:border-[#1B3A6B]
                            "
                        />
                
                        {/* Filtre statut */}
                        <select
                            value={applicationStatusFilter}
                            onChange={(e) =>
                                setApplicationStatusFilter(
                                    e.target.value as
                                        | "all"
                                        | "submitted"
                                        | "accepted"
                                        | "rejected"
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-black
                                outline-none
                                focus:border-[#1B3A6B]
                            "
                        >
                            <option value="all">
                                Tous les statuts
                            </option>
                        
                            <option value="submitted">
                                En attente
                            </option>
                        
                            <option value="accepted">
                                Acceptées
                            </option>
                        
                            <option value="rejected">
                                Refusées
                            </option>
                        </select>
                        
                        {/* Filtre offre */}
                        <select
                            value={applicationJobFilter}
                            onChange={(e) =>
                                setApplicationJobFilter(e.target.value)
                            }
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-black
                                outline-none
                                focus:border-[#1B3A6B]
                            "
                        >
                            <option value="all">
                                Toutes les offres
                            </option>
                        
                            {jobs.map((job) => (
                                <option
                                    key={job.id}
                                    value={job.id.toString()}
                                >
                                    {job.title}
                                </option>
                            ))}
                        </select>
                        
                        {/* Tri date */}
                        <select
                            value={applicationDateSort}
                            onChange={(e) =>
                                setApplicationDateSort(
                                    e.target.value as "desc" | "asc"
                                )
                            }
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-3
                                py-2
                                text-sm
                                text-black
                                outline-none
                                focus:border-[#1B3A6B]
                            "
                            aria-label="Trier les candidatures par date"
                        >
                            <option value="desc">
                                Plus récentes d'abord
                            </option>
                        
                            <option value="asc">
                                Plus anciennes d'abord
                            </option>
                        </select>
                        <button
                            type="button"
                            onClick={() => {
                                setApplicationStatusFilter("all");
                                setApplicationJobFilter("all");
                                setApplicationDateSort("desc");
                                setApplicationSearch("");
                            }}
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                px-3
                                py-2
                                text-sm
                                hover:bg-gray-100
                            "
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>

        {applications.length === 0 ? (
            <p className="text-gray-500">
                Aucune candidature reçue.
            </p>
        ) : filteredApplications.length === 0 ? (
            <p className="text-gray-500">
                Aucune candidature ne correspond aux filtres sélectionnés.
            </p>
        ) : (
    filteredApplications.map((application) => (
            <div
                key={application.id}
                className="flex justify-between rounded-lg px-2 py-3 hover:bg-gray-100"
            >
                <div className="flex gap-2 px-5">
                    <div className="border border-[#FFA500]"></div>

                    <div>
                        <h1 className="font-semibold">
                            {application.job.title}
                        </h1>

                        <p>
                            {application.seeker.user.firstName}{" "}
                            {application.seeker.user.lastName}
                        </p>

                        <p className="text-sm text-gray-500">
                            {application.seeker.user.email}
                        </p>

                        <p className="mt-1 text-sm">
                            Statut :{" "}
                            <span className="font-bold">
                                {application.status}
                            </span>
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Reçue le {formatApplicationDate(application.createdAt)}
                        </p>
                    </div>
                </div>
                <DashboardApplicationModal
                    isOpen={applicationOpen}
                    setOpen={setApplicationOpen}
                    application={selectedApplication}
                />
                <div className="flex items-center gap-4">
                    <button
                        className="cursor-pointer hover:underline"
                        onClick={() =>
                            handleApplicationSelection(application)
                        }
                    >
                        voir la candidature ▾
                    </button>

                    <button
                        onClick={() =>
                            updateApplicationStatus(
                                application.id,
                                "accepted"
                            )
                        }
                        title="Accepter la candidature"
                        className="cursor-pointer"
                    >
                        <img
                            className="size-5 shrink-0"
                            src={verifier.src}
                            alt="Accepter"
                        />
                    </button>

                    <button
                        onClick={() =>
                            updateApplicationStatus(
                                application.id,
                                "rejected"
                            )
                        }
                        title="Refuser la candidature"
                        className="cursor-pointer"
                    >
                        <img
                            className="size-4 shrink-0"
                            src={croix.src}
                            alt="Refuser"
                        />
                    </button>
                </div>
            </div>
        ))
    )}
            </div>

            <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">
                <h1 className="text-xl font-bold text-black">
                    Vos offres ({lengthOkJob})
                </h1>

                {jobs.filter(job => okJob.includes(job.status)).map(job =>
                    <div key={job.id}
                        className="flex justify-between hover:bg-gray-200 hover:cursor-pointer rounded-lg"
                        onClick={() => handleJobSelection(job)}>
                        <div className="flex gap-2 px-5">
                            <div className="border border-[#FFA500]"></div>
                            <div>
                                <h1>
                                    {job.title}
                                </h1>
                                <p>
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            Vues :
                            <p className="font-bold px-2">
                                {job.views}
                            </p>
                        </div>
                    </div>
                )}
                <DashboardJobModal isOpen={open} setOpen={setOpen} job={selectedJob}/>

            </div>

            <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">
                <h1 className="text-xl font-bold text-black">
                    Vos offres en cours de validation ({lengthtoCheckJob})
                </h1>

                {jobs.filter(job => toCheckJob.includes(job.status)).map(job =>
                    <div key={job.id}
                        className="flex justify-between hover:bg-gray-200 hover:cursor-pointer rounded-lg"
                        onClick={() => handleJobSelection(job)}>
                        <div className="flex gap-2 px-5">
                            <div className="border border-[#1B3A6B]"></div>
                            <div>
                                <h1>
                                    {job.title}
                                </h1>
                                <p>
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            Vues : <p className="font-bold px-2">0</p>
                        </div>
                    </div>
                )}
                <DashboardJobModal isOpen={open} setOpen={setOpen} job={selectedJob}/>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">
                <h1 className="text-xl font-bold text-black">
                    Vos offres archivées ({lengthArchiveJob})
                </h1>

                {jobs.filter(job => archiveJob.includes(job.status)).map(job =>
                    <div key={job.id}
                        className="flex justify-between hover:bg-gray-200 hover:cursor-pointer rounded-lg"
                        onClick={() => handleJobSelection(job)}>
                        <div className="flex gap-2 px-5">
                            <div className="border border-[#1B3A6B]"></div>
                            <div>
                                <h1>
                                    {job.title}
                                </h1>
                                <p>
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            Vues : <p className="font-bold px-2">0</p>
                        </div>
                    </div>
                )}
                <DashboardJobModal isOpen={open} setOpen={setOpen} job={selectedJob}/>
            </div>
            <section className="rounded-2xl bg-white p-6 shadow-[0_0_25px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold text-black">
                        Géolocalisation
                      </h3>

                      <p className="text-gray-600">
                        Consultez les informations relatives à
                        l'utilisation de votre localisation par GéoEmploi.
                      </p>

                      <button
                        type="button"
                        onClick={() => setLocationInfoOpen(true)}
                        className="
                          w-fit
                          cursor-pointer
                          rounded-lg
                          border
                          border-[#FFA500]
                          px-5
                          py-3
                          font-semibold
                          text-black
                          hover:bg-[#FFA500]/50
                          bg-[#FFA500]
                        "
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
                        <h2 className="text-xl font-bold text-black">
                            Mes données personnelles
                        </h2>
                        <p className="mt-1 text-gray-600">
                            Téléchargez une copie des données personnelles
                            que GéoEmploi détient à votre sujet.
                        </p>
                    </div>
                    <DownloadExportButton />
                </div>
            </section>
            <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-[0_0_25px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-red-600">
                            Supprimer mon compte
                        </h2>
                        <p className="mt-1 text-gray-600">
                            La suppression de votre compte est définitive.
                            Toutes vos offres ainsi que les candidatures
                            associées seront supprimées.
                        </p>
                    </div>
                    <DeleteAccountButton />
                </div>
            </section>
        </div>
    )
}

export default DashboardPc;