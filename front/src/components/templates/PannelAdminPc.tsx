import poubelle from "../../assets/poubelle.png"
import croix from "../../assets/croix.png"
import verifier from "../../assets/verifier.png"
import { useEffect, useState } from "react";
import DashboardJobModal from "../modal/DashboardJobModal";
import DashbordCandidatureModal from "../modal/DashboardCandidatureModal";
import BarVerticalStats from "../BarVerticalStats"
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
    createdAt: string;
}

function getStatusByJob(job: Job) {
    if (job.status == 'active') {
        return (
            <div className="flex items-center bg-green-500/25 w-fit h-fit rounded-lg ">
                <p className="font-bold px-2">Actif</p>
            </div>
        )
    } else if (job.status == 'archived') {
        return (
            <div className="flex items-center bg-gray-500/25 w-fit h-fit rounded-lg">
                <p className="font-bold px-2">Archivé</p>
            </div>
        )
    } else {
        return (
            <div className="flex items-center bg-orange-500/25 w-fit h-fit rounded-lg">
                <p className="font-bold px-2">En cours</p>
            </div>
        )
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
            const [responseJobs, responseUsers, responseApplications] = await Promise.all([
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
            ]);
            const jobsResult = await responseJobs.json();
            const usersResult = await responseUsers.json();
            const applicationsResult = await responseApplications.json();

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

    const [users, setUsers] = useState<User[]>([]);
    const [openModalUser, setOpenModalUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const lengthUsers = users.length;
    const employerCount = users.filter(user => user.role === "employer").length;
    const seekerCount = users.filter(user => user.role === "seeker").length;
    const adminCount = users.filter(user => user.role === "admin").length;

    const [searchTermJobs, setSearchTermJobs] = useState("");
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTermJobs.toLowerCase())
    );
    const [searchTermCandidatures, setSearchTermCandidatures] = useState("");
    const filteredCandidatures = candidatures.filter(candidature => {
        const search = searchTermCandidatures.toLowerCase();
        return (candidature.job.title.toLowerCase().includes(search) || candidature.seeker.user.firstName.toLowerCase().includes(search) || candidature.seeker.user.lastName.toLowerCase().includes(search));

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
            <div>
                <h1 className="text-2xl font-bold text-black">
                    Espace administrateur
                </h1>
            </div>

{/* STATISTIQUES */}
            <div className="flex flex-row gap-16">
                <div className="flex flex-col w-full">
                    <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">
                        <h1 className="text-xl font-bold text-black">
                            Statistiques
                        </h1>
                        <div className="flex flex-row">
                            <BarVerticalStats data={dataType}/>
                            <BarVerticalStats data={dataPub}/>
                        </div>
                    </div>
                </div>

{/* OFFRES */}
                <div className="flex flex-col gap-6 w-full">
                    <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">
                        <h1 className="text-xl font-bold text-black">
                            Les offres ({lengthJob})
                        </h1>

                        {jobs.length == 0 &&
                            <div>
                                <p>Aucune offre publiée.</p>
                            </div>
                        }

                        <Input placeHolder="Chercher un job..." value={searchTermJobs} onChange={(e) => setSearchTermJobs(e.target.value)}/>
                        {filteredJobs.map(job =>
                            <div key={job.id}
                                className="flex justify-between hover:bg-gray-200 hover:cursor-pointer rounded-lg"
                                onClick={() => handleJobSelection(job)}>
                                <div className="flex gap-2 px-5">
                                    <div className="border border-[#FFA500]"></div>
                                    <div>
                                        <h1 className="font-bold">
                                            {job.title}
                                        </h1>
                                        <p>
                                            {job.description}
                                        </p>
                                    </div>
                                </div>

                                {getStatusByJob(job)}
                            </div>
                        )}
                        <DashboardJobModal isOpen={openModalJob} setOpen={setOpenModalJob} job={selectedJob} adminMode={true}
                            onJobUpdated={(updatedJob) => {
                                setJobs(previousJobs =>
                                    previousJobs.map(job =>
                                        job.id === updatedJob.id ? updatedJob : job
                                    )
                        );

        setSelectedJob(updatedJob);
    }}/>
                    </div>

{/* CANDIDATURES */}
                    <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">
                        <h1 className="text-xl font-bold text-black">
                            Les candidatures ({lengthCandidatures})
                        </h1>

                        {candidatures.length == 0 &&
                            <div>
                                <p>Aucune candidature publiée.</p>
                            </div>
                        }

                        <Input placeHolder="Chercher une candidature..." value={searchTermCandidatures} onChange={(e) => setSearchTermCandidatures(e.target.value)}/>
                        {filteredCandidatures.map(candidature =>
                            <div key={candidature.id}
                                className="flex justify-between hover:bg-gray-200 hover:cursor-pointer rounded-lg"
                                onClick={() => handleCandidatureSelection(candidature)}>
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
                        )}
                        <DashbordCandidatureModal isOpen={openModalCandidature} setOpen={setOpenModalCandidature} candidature={selectedCandidature}/>
                    </div>

{/* USERS */}
                    <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">
                        <h1 className="text-xl font-bold text-black">
                            Utilisateurs ({lengthUsers})
                        </h1>

                        {lengthUsers == 0 &&
                            <div>
                                <p>Aucun utilisateur.</p>
                            </div>
                        }

                        <Input placeHolder="Chercher un utilisateur..." value={searchTermUsers} onChange={(e) => setSearchTermUsers(e.target.value)}/>
                        {filteredUsers.map(user =>
                            <div key={user.id}
                                className="flex justify-between hover:bg-gray-200 hover:cursor-pointer rounded-lg"
                                onClick={() => handleUserSelection(user)}>
                                <div className="flex gap-2 px-5">
                                    <div className="border border-[#FFA500]"></div>
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
                                </div>
                            </div>
                        )}
                        {/* <DashbordCandidatureModal isOpen={openModalUser} setOpen={setOpenModalUser} candidature={selectedUser}/> */}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PannelAdminPc;