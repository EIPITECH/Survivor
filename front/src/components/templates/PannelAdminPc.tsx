import { useEffect, useState } from "react";
import DashboardJobModal from "../modal/DashboardJobModal";
import DashbordCandidatureModal from "../modal/DashboardCandidatureModal";
import BarVerticalStats from "../BarVerticalStats"
import DashboardUserModal from "../modal/dashboardUserModal";
import Input from "../../components/buttons/Input"
import Cookies from "js-cookie";

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
    createdAt: string
}

interface Candidature {
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

interface Report {
    id: number;
    reason:
        | "fraud"
        | "misleading"
        | "inappropriate"
        | "expired"
        | "other";
    message: string | null;
    status: "pending" | "resolved" | "rejected";
    createdAt: string;
    job: Job;
}

function getReportReasonLabel(reason: Report["reason"]) {
    switch (reason) {
        case "fraud":
            return "Offre frauduleuse";
        case "misleading":
            return "Informations trompeuses";
        case "inappropriate":
            return "Contenu inapproprié";
        case "expired":
            return "Offre expirée";
        case "other":
            return "Autre";
        default:
            return reason;
    }
}

function getReportStatus(status: Report["status"]) 
{
    if (status === "pending") {
        return (
            <div className="w-fit rounded-lg bg-orange-500/25 px-2 py-1">
                <p className="text-sm font-bold text-orange-800">
                    À traiter
                </p>
            </div>
        );
    }

    if (status === "resolved") {
        return (
            <div className="w-fit rounded-lg bg-green-500/25 px-2 py-1">
                <p className="text-sm font-bold text-green-800">
                    Traité
                </p>
            </div>
        );
    }

    return (
        <div className="w-fit rounded-lg bg-red-500/25 px-2 py-1">
            <p className="text-sm font-bold text-red-800">
                Rejeté
            </p>
        </div>
    );
}

function getStatusByJob(job: Job) {
    switch (job.status) {
        case "active":
            return (
                <div className="w-fit rounded-lg bg-green-500/25 px-2 py-1">
                    <p className="text-sm font-bold text-green-800">
                        Active
                    </p>
                </div>
            );

        case "toCheck":
            return (
                <div className="w-fit rounded-lg bg-orange-500/25 px-2 py-1">
                    <p className="text-sm font-bold text-orange-800">
                        À vérifier
                    </p>
                </div>
            );

        case "archived":
            return (
                <div className="w-fit rounded-lg bg-gray-500/25 px-2 py-1">
                    <p className="text-sm font-bold text-gray-700">
                        Archivée
                    </p>
                </div>
            );

        default:
            return (
                <div className="w-fit rounded-lg bg-gray-100 px-2 py-1">
                    <p className="text-sm font-bold text-gray-600">
                        {job.status}
                    </p>
                </div>
            );
    }
}

function getToken(): string | null 
{
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

function PannelAdminPc() 
{
    useEffect(() => {
    async function loadAdminData() 
    {
        const token = getToken();
        if (!token) {
            console.error("Aucun token administrateur trouvé");
            return;
        }
        try {
            const [
                responseJobs,
                responseUsers,
                responseApplications,
                responseReports
            ] = await Promise.all([
                fetch("http://localhost:3000/jobs"),
            
                fetch("http://localhost:3000/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            
                fetch("http://localhost:3000/applications/admin", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            
                fetch("http://localhost:3000/reports", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);
            const jobsResult = await responseJobs.json();
            const usersResult = await responseUsers.json();
            const applicationsResult = await responseApplications.json();
            const reportsResult = await responseReports.json();

            if (responseJobs.ok) {
                setJobs(jobsResult);
            } else {
                console.error("Erreur récupération offres :", jobsResult);
            }
            if (responseUsers.ok) {
                setUsers(usersResult);
            } else {
                console.error("Erreur récupération utilisateurs :", usersResult);
            }
            if (responseApplications.ok) {
                setCandidatures(applicationsResult);
            } else {
                console.error("Erreur récupération candidatures :", applicationsResult);
            }
            if (responseReports.ok) {
                setReports(reportsResult);
            } else {
                console.error("Erreur récupération signalements :", reportsResult);
            }

            } catch (error) {
                console.error("Erreur chargement panel admin :", error);
            }
        }
        loadAdminData();
    }, []);
    const handleJobSelection = (job: Job) => {
        setSelectedJob(job);
        setOpenModalJob(true);
    }

    async function updateReportStatus(reportId: number, status: Report["status"]) 
    {
        const token = getToken();

        if (!token) {
            setReportError("Token administrateur introuvable");
            return;
        }

        setUpdatingReportId(reportId);
        setReportError("");

        try {
            const response = await fetch(`http://localhost:3000/reports/${reportId}/status`,
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
                throw new Error(Array.isArray(result.message) ? result.message.join(", ") : result.message || "Impossible de modifier le signalement");
            }

            setReports(previousReports => previousReports.map(report => report.id === reportId ? result : report));
        } catch (error) {
            if (error instanceof Error) {
                setReportError(error.message);
            } else {
                setReportError(
                    "Une erreur est survenue."
                );
            }
        } finally {
            setUpdatingReportId(null);
        }
    }
    const handleCandidatureSelection = (candidature: Candidature) => {
        setSelectedCandidature(candidature);
        setOpenModalCandidature(true);
    }

    const handleUserSelection = (user: User) => {
        setSelectedUser(user);
        setOpenModalUser(true);
    }

    const [jobs, setJobs] = useState<Job[]>([]);
    const [openModalJob, setOpenModalJob] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const lengthJob = jobs.length;

    const [candidatures, setCandidatures] = useState<Candidature[]>([]);
    const [openModalCandidature, setOpenModalCandidature] = useState(false);
    const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
    const lengthCandidatures = candidatures.length;

    const [reports, setReports] = useState<Report[]>([]);
    const [searchTermReports, setSearchTermReports] = useState("");

    const [reportStatusFilter, setReportStatusFilter] = useState<"all" | Report["status"]>("all");

    const [updatingReportId, setUpdatingReportId] = useState<number | null>(null);
    const [reportError, setReportError] = useState("");
    const pendingReportsCount = reports.filter(report => report.status === "pending").length;
    const [users, setUsers] = useState<User[]>([]);
    const [openModalUser, setOpenModalUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const lengthUsers = users.length;
    const employerCount = users.filter(user => user.role === "employer").length;
    const seekerCount = users.filter(user => user.role === "seeker").length;
    const adminCount = users.filter(user => user.role === "admin").length;

    const filteredReports = reports.filter(report => {
        const search = searchTermReports.toLowerCase();

        const matchesSearch = report.job.title.toLowerCase().includes(search) || getReportReasonLabel(report.reason).toLowerCase().includes(search) || (report.message ?? "").toLowerCase().includes(search);
        const matchesStatus = reportStatusFilter === "all" || report.status === reportStatusFilter;
        return matchesSearch && matchesStatus;
    });

    const [searchTermJobs, setSearchTermJobs] = useState("");
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTermJobs.toLowerCase())
    );
    const [searchTermCandidatures, setSearchTermCandidatures] = useState("");
    const [candidatureDateSort, setCandidatureDateSort] = useState<"desc" | "asc">("desc");

    const filteredCandidatures = candidatures
        .filter(candidature => {
            const search = searchTermCandidatures.toLowerCase();

            return (
                candidature.job.title.toLowerCase().includes(search) ||
                candidature.seeker.user.firstName.toLowerCase().includes(search) ||
                candidature.seeker.user.lastName.toLowerCase().includes(search)
            );
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            return candidatureDateSort === "desc"
                ? dateB - dateA
                : dateA - dateB;
        });
        const formatCandidatureDate = (createdAt: string) =>
        new Date(createdAt).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const [searchTermUsers, setSearchTermUsers] = useState("");
    const filteredUsers = users.filter(user => {
        const search = searchTermUsers.toLowerCase();

        return (user.firstName.toLowerCase().includes(search) || user.lastName.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
    });

    const dataType: [string, number][] = 
    [
        ["Employeurs", employerCount],
        ["Chercheurs d'emploi", seekerCount],
        ["Administrateurs", adminCount],
    ];

    const dataPub: [string, number][] = 
    [
        ["Offres", jobs.length],
        ["Candidatures", candidatures.length],
    ];

    return (
    <div className="flex flex-col gap-6 px-10 py-8">

        {/* TITRE */}
        <div>
            <h1 className="text-2xl font-bold text-black">
                Espace administrateur
            </h1>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="flex flex-row items-start gap-6">

            {/* ====================================================== */}
            {/* COLONNE GAUCHE                                         */}
            {/* ====================================================== */}

            <div className="flex w-full flex-col gap-6">

                {/* STATISTIQUES */}
                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        rounded-2xl
                        bg-white
                        p-6
                        shadow-[0_0_25px_rgba(0,0,0,0.15)]
                    "
                >
                    <h1 className="text-xl font-bold text-black">
                        Statistiques
                    </h1>

                    <div className="flex flex-row">
                        <BarVerticalStats data={dataType}/>
                        <BarVerticalStats data={dataPub}/>
                    </div>
                </div>


                {/* ================================================== */}
                {/* CANDIDATURES                                       */}
                {/* ================================================== */}

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        rounded-2xl
                        bg-white
                        p-6
                        shadow-[0_0_25px_rgba(0,0,0,0.15)]
                    "
                >
                    <h1 className="text-xl font-bold text-black">
                        Les candidatures ({lengthCandidatures})
                    </h1>

                    {candidatures.length === 0 && (
                        <div>
                            <p>Aucune candidature publiée.</p>
                        </div>
                    )}

                    <Input
                        placeHolder="Chercher une candidature..."
                        value={searchTermCandidatures}
                        onChange={(e) =>
                            setSearchTermCandidatures(e.target.value)
                        }
                    />

                    <div className="flex max-h-[450px] flex-col gap-2 overflow-y-auto pr-2">
                        {filteredCandidatures.map(candidature => (
                            <div
                                key={candidature.id}
                                className="
                                    flex
                                    justify-between
                                    rounded-lg
                                    py-2
                                    transition
                                    hover:cursor-pointer
                                    hover:bg-gray-200
                                "
                                onClick={() =>
                                    handleCandidatureSelection(candidature)
                                }
                            >
                                <div className="flex gap-2 px-5">

                                    <div className="border border-[#FFA500]"></div>

                                    <div>
                                        <h1 className="font-bold">
                                            {candidature.job.title}
                                        </h1>

                                        <p>
                                            {candidature.seeker.user.firstName}{" "}
                                            {candidature.seeker.user.lastName}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {candidature.seeker.user.email}
                                        </p>

                                        <p className="text-sm">
                                            Statut : {candidature.status}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    <DashbordCandidatureModal
                        isOpen={openModalCandidature}
                        setOpen={setOpenModalCandidature}
                        candidature={selectedCandidature}
                    />
                </div>


                {/* ================================================== */}
                {/* UTILISATEURS                                       */}
                {/* ================================================== */}

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        rounded-2xl
                        bg-white
                        p-6
                        shadow-[0_0_25px_rgba(0,0,0,0.15)]
                    "
                >
                    <h1 className="text-xl font-bold text-black">
                        Utilisateurs ({lengthUsers})
                    </h1>

                    {lengthUsers === 0 && (
                        <div>
                            <p>Aucun utilisateur.</p>
                        </div>
                    )}

                    <Input
                        placeHolder="Chercher un utilisateur..."
                        value={searchTermUsers}
                        onChange={(e) =>
                            setSearchTermUsers(e.target.value)
                        }
                    />

                    <div className="flex flex-col gap-2">

                        {filteredUsers.map(user => (
                            <div
                                key={user.id}
                                className="
                                    flex
                                    justify-between
                                    rounded-lg
                                    py-2
                                    transition
                                    hover:cursor-pointer
                                    hover:bg-gray-200
                                "
                                onClick={() =>
                                    handleUserSelection(user)
                                }
                            >
                                <div className="flex w-full gap-2 px-5">

                                    <div className="border border-[#FFA500]"></div>

                                    <div className="flex w-full items-center justify-between">

                                        <div>
                                            <h1 className="font-bold">
                                                {user.firstName} {user.lastName}
                                            </h1>

                                            <p>
                                                {user.email}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Rôle : {user.role}
                                            </p>
                                        </div>

                                        {user.accountStatus === "suspended" ? (
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    rounded-lg
                                                    bg-red-100
                                                    px-3
                                                    py-1
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
                                                        text-sm
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
                                                    items-center
                                                    gap-2
                                                    rounded-lg
                                                    bg-green-100
                                                    px-3
                                                    py-1
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
                                                        text-sm
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
                            </div>
                        ))}

                    </div>

                    <DashboardUserModal
                        isOpen={openModalUser}
                        setOpen={setOpenModalUser}
                        user={selectedUser}
                        onUserUpdated={(updatedUser) => {
                            setUsers(previousUsers =>
                                previousUsers.map(user =>
                                    user.id === updatedUser.id
                                        ? updatedUser
                                        : user
                                )
                            );
                            setSelectedUser(updatedUser);
                        }}
                    />

                </div>

            </div>


            {/* ====================================================== */}
            {/* COLONNE DROITE                                        */}
            {/* ====================================================== */}

            <div className="flex w-full flex-col gap-6">

                {/* ================================================== */}
                {/* OFFRES                                             */}
                {/* ================================================== */}

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        rounded-2xl
                        bg-white
                        p-6
                        shadow-[0_0_25px_rgba(0,0,0,0.15)]
                    "
                >
                    <h1 className="text-xl font-bold text-black">
                        Les offres ({lengthJob})
                    </h1>

                    {jobs.length === 0 && (
                        <div>
                            <p>Aucune offre publiée.</p>
                        </div>
                    )}

                    <Input
                        placeHolder="Chercher un job..."
                        value={searchTermJobs}
                        onChange={(e) =>
                            setSearchTermJobs(e.target.value)
                        }
                    />

                    {/* LISTE DES OFFRES SCROLLABLE */}
                    <div
                        className="
                            flex
                            max-h-[600px]
                            flex-col
                            gap-2
                            overflow-y-auto
                            pr-2
                        "
                    >
                        {filteredJobs.map(job => (
                            <div
                                key={job.id}
                                className="
                                    flex
                                    justify-between
                                    gap-4
                                    rounded-lg
                                    p-2
                                    transition
                                    hover:cursor-pointer
                                    hover:bg-gray-200
                                "
                                onClick={() =>
                                    handleJobSelection(job)
                                }
                            >
                                <div className="flex min-w-0 gap-2">

                                    <div className="border border-[#FFA500]"></div>

                                    <div className="min-w-0">

                                        <h1 className="font-bold">
                                            {job.title}
                                        </h1>

                                        <p
                                            className="
                                                line-clamp-2
                                                text-sm
                                                text-gray-600
                                            "
                                        >
                                            {job.description}
                                        </p>

                                    </div>

                                </div>

                                <div className="shrink-0">
                                    {getStatusByJob(job)}
                                </div>

                            </div>
                        ))}
                    </div>

                    <DashboardJobModal
                        isOpen={openModalJob}
                        setOpen={setOpenModalJob}
                        job={selectedJob}
                        adminMode={true}
                        onJobUpdated={(updatedJob) => {

                            setJobs(previousJobs =>
                                previousJobs.map(job =>
                                    job.id === updatedJob.id
                                        ? updatedJob
                                        : job
                                )
                            );

                            setSelectedJob(updatedJob);
                        }}
                    />

                </div>


                {/* ================================================== */}
                {/* SIGNALEMENTS                                       */}
                {/* ================================================== */}

                <div
                    className="
                        flex
                        flex-col
                        gap-4
                        rounded-2xl
                        bg-white
                        p-6
                        shadow-[0_0_25px_rgba(0,0,0,0.15)]
                    "
                >

                    {/* HEADER */}
                    <div className="flex items-center justify-between">

                        <h1 className="text-xl font-bold text-black">
                            Signalements ({reports.length})
                        </h1>

                        {pendingReportsCount > 0 && (
                            <div
                                className="
                                    rounded-full
                                    bg-orange-100
                                    px-3
                                    py-1
                                    text-sm
                                    font-bold
                                    text-orange-800
                                "
                            >
                                {pendingReportsCount} à traiter
                            </div>
                        )}

                    </div>


                    {/* AUCUN SIGNALEMENT */}
                    {reports.length === 0 && (
                        <p className="text-gray-500">
                            Aucun signalement.
                        </p>
                    )}


                    {reports.length > 0 && (
                        <>

                            {/* RECHERCHE */}
                            <Input
                                placeHolder="Chercher un signalement..."
                                value={searchTermReports}
                                onChange={(e) =>
                                    setSearchTermReports(e.target.value)
                                }
                            />


                            {/* FILTRES */}
                            <div className="flex flex-wrap gap-2">

                                {/* TOUS */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setReportStatusFilter("all")
                                    }
                                    className={`
                                        rounded-lg
                                        px-3
                                        py-2
                                        text-sm
                                        font-semibold
                                        transition
                                        hover:cursor-pointer

                                        ${
                                            reportStatusFilter === "all"
                                                ? "bg-[#1B3A6B] text-white"
                                                : "bg-gray-100 text-black hover:bg-gray-200"
                                        }
                                    `}
                                >
                                    Tous
                                </button>


                                {/* PENDING */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setReportStatusFilter("pending")
                                    }
                                    className={`
                                        rounded-lg
                                        px-3
                                        py-2
                                        text-sm
                                        font-semibold
                                        transition
                                        hover:cursor-pointer

                                        ${
                                            reportStatusFilter === "pending"
                                                ? "bg-orange-500 text-white"
                                                : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                        }
                                    `}
                                >
                                    À traiter
                                </button>


                                {/* RESOLVED */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setReportStatusFilter("resolved")
                                    }
                                    className={`
                                        rounded-lg
                                        px-3
                                        py-2
                                        text-sm
                                        font-semibold
                                        transition
                                        hover:cursor-pointer

                                        ${
                                            reportStatusFilter === "resolved"
                                                ? "bg-green-600 text-white"
                                                : "bg-green-100 text-green-800 hover:bg-green-200"
                                        }
                                    `}
                                >
                                    Traités
                                </button>


                                {/* REJECTED */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setReportStatusFilter("rejected")
                                    }
                                    className={`
                                        rounded-lg
                                        px-3
                                        py-2
                                        text-sm
                                        font-semibold
                                        transition
                                        hover:cursor-pointer

                                        ${
                                            reportStatusFilter === "rejected"
                                                ? "bg-red-600 text-white"
                                                : "bg-red-100 text-red-800 hover:bg-red-200"
                                        }
                                    `}
                                >
                                    Rejetés
                                </button>

                            </div>


                            {/* ERREUR API */}
                            {reportError && (
                                <div
                                    className="
                                        rounded-lg
                                        bg-red-100
                                        px-4
                                        py-3
                                        text-sm
                                        text-red-700
                                    "
                                >
                                    {reportError}
                                </div>
                            )}


                            {/* LISTE DES SIGNALEMENTS */}
                            <div
                                className="
                                    flex
                                    max-h-[500px]
                                    flex-col
                                    gap-3
                                    overflow-y-auto
                                    pr-2
                                "
                            >

                                {filteredReports.map(report => (

                                    <div
                                        key={report.id}
                                        className="
                                            rounded-xl
                                            border
                                            border-gray-200
                                            p-4
                                        "
                                    >

                                        {/* TITRE + STATUS */}
                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-3
                                            "
                                        >

                                            <div>

                                                <h2 className="font-bold text-black">
                                                    {report.job.title}
                                                </h2>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        font-semibold
                                                        text-red-700
                                                    "
                                                >
                                                    {getReportReasonLabel(
                                                        report.reason
                                                    )}
                                                </p>

                                            </div>

                                            <div className="shrink-0">
                                                {getReportStatus(
                                                    report.status
                                                )}
                                            </div>

                                        </div>


                                        {/* MESSAGE */}
                                        {report.message && (
                                            <p
                                                className="
                                                    mt-3
                                                    line-clamp-3
                                                    text-sm
                                                    text-gray-600
                                                "
                                            >
                                                {report.message}
                                            </p>
                                        )}


                                        {/* DATE */}
                                        <p className="mt-2 text-xs text-gray-400">
                                            Signalé le{" "}
                                            {new Date(
                                                report.createdAt
                                            ).toLocaleString(
                                                "fr-FR"
                                            )}
                                        </p>


                                        {/* ACTIONS */}
                                        <div
                                            className="
                                                mt-4
                                                flex
                                                flex-wrap
                                                gap-2
                                            "
                                        >

                                            {/* VOIR OFFRE */}
                                            <button
                                                type="button"
                                                onClick={() => {

                                                    setSelectedJob(
                                                        report.job
                                                    );

                                                    setOpenModalJob(
                                                        true
                                                    );
                                                }}
                                                className="
                                                    rounded-lg
                                                    bg-[#1B3A6B]
                                                    px-3
                                                    py-2
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    transition
                                                    hover:cursor-pointer
                                                    hover:bg-[#142d55]
                                                "
                                            >
                                                Voir l'offre
                                            </button>


                                            {/* SI PENDING */}
                                            {report.status === "pending" && (
                                                <>

                                                    {/* TRAITER */}
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            updatingReportId ===
                                                            report.id
                                                        }
                                                        onClick={() =>
                                                            updateReportStatus(
                                                                report.id,
                                                                "resolved"
                                                            )
                                                        }
                                                        className="
                                                            rounded-lg
                                                            bg-green-600
                                                            px-3
                                                            py-2
                                                            text-sm
                                                            font-semibold
                                                            text-white
                                                            transition
                                                            hover:cursor-pointer
                                                            hover:bg-green-700
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50
                                                        "
                                                    >
                                                        {updatingReportId ===
                                                        report.id
                                                            ? "Traitement..."
                                                            : "Traiter"}
                                                    </button>


                                                    {/* REJETER */}
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            updatingReportId ===
                                                            report.id
                                                        }
                                                        onClick={() =>
                                                            updateReportStatus(
                                                                report.id,
                                                                "rejected"
                                                            )
                                                        }
                                                        className="
                                                            rounded-lg
                                                            bg-red-600
                                                            px-3
                                                            py-2
                                                            text-sm
                                                            font-semibold
                                                            text-white
                                                            transition
                                                            hover:cursor-pointer
                                                            hover:bg-red-700
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50
                                                        "
                                                    >
                                                        Rejeter
                                                    </button>

                                                </>
                                            )}


                                            {/* SI DEJA TRAITE OU REJETE */}
                                            {report.status !== "pending" && (

                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingReportId ===
                                                        report.id
                                                    }
                                                    onClick={() =>
                                                        updateReportStatus(
                                                            report.id,
                                                            "pending"
                                                        )
                                                    }
                                                    className="
                                                        rounded-lg
                                                        bg-gray-200
                                                        px-3
                                                        py-2
                                                        text-sm
                                                        font-semibold
                                                        text-black
                                                        transition
                                                        hover:cursor-pointer
                                                        hover:bg-gray-300
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                    "
                                                >
                                                    Réouvrir
                                                </button>

                                            )}

                                        </div>

                                    </div>
                                ))}


                                {/* AUCUN RESULTAT APRES FILTRE */}
                                {filteredReports.length === 0 &&
                                    reports.length > 0 && (

                                        <p
                                            className="
                                                py-4
                                                text-center
                                                text-gray-500
                                            "
                                        >
                                            Aucun signalement correspondant.
                                        </p>

                                    )
                                }

                            </div>

                        </>
                    )}

                </div>

            </div>

        </div>

    </div>
);
}
export default PannelAdminPc;
