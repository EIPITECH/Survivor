import poubelle from "../../assets/poubelle.png"
import croix from "../../assets/croix.png"
import verifier from "../../assets/verifier.png"
import { useEffect, useState } from "react";
import DashboardJobModal from "../modal/DashboardJobModal";
import DashbordCandidatureModal from "../modal/DashboardCandidatureModal";
import BarVerticalStats from "../BarVerticalStats"
import Input from "../../components/buttons/Input"

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
    title: string;
    description: string;
    status: string,
    obtentionDate: string,
    createdAt: string
}

interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    isConnected: boolean,
    role: string,
    createdAt: string,
    seeker: string
}

const fakeJob: Job = {
    id: 1,
    title: "Développeur fullstack",
    description: "Nous recherchons un·e développeur·se fullstack pour rejoindre notre équipe technique et participer à la conception et à l'évolution de nos applications web, du back-end à l'interface utilisateur.",
    cityName: "Lyon",
    streetNumber: 12,
    streetName: "Rue de la République",
    zipCode: 69002,
    latitude: 45.7640,
    longitude: 4.8357,
    employerId: 7,
    status: "active",
    geocodageSource: "Google Maps API",
    trustScore: 0.87,
    obtentionDate: "2026-08-15T09:00:00.000Z",
    createdAt: "2026-09-04T08:08:17.438Z"
};



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

const fakeCandidature: Candidature = {
    id: 1,
    title: "Développeur fullstack",
    description: "Candidature envoyée pour le poste de développeur fullstack au sein de l'équipe technique.",
    status: "pending",
    obtentionDate: "2026-08-15T09:00:00.000Z",
    createdAt: "2026-09-04T08:08:17.438Z"
};

function PannelAdminPc() {

    const request = new Request("http://localhost:3000/jobs", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        // credentials: "include"
    })

    const requestUsers = new Request("http://localhost:3000/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })

    useEffect(() => {

        // setJobs([fakeJob]);
        // setCandidatures([fakeCandidature]);
        // return;


        async function getAllJobsByUser(request:Request) {
            try {
                const responseJobs = await fetch(request);
                const resultJobs = await responseJobs.json();

                const responseUsers = await fetch(requestUsers);
                const resultUsers = await responseUsers.json();

                if (responseJobs.ok) {
                    console.log("Get all jobs is success: ", resultJobs);
                    setJobs(resultJobs);
                } else {
                    console.error("Error de récupération des jobs: ", resultJobs);
                }

                if (responseUsers.ok) {
                    console.log("Get all jobs is success: ", resultJobs);
                    setUsers(resultUsers);
                } else {
                    console.error("Erreur de récupération des utilisateurs: ", resultUsers)
                }
            } catch (error) {
                console.error("Error lors du fetch: ", error);
            }
        }

        getAllJobsByUser(request)
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
    const okJob = ['active'];
    const toCheckJob = ['toCheck'];
    const archiveJob = ['archived']
    const lengthJob = jobs.length;
    const lengthOkJob = jobs.filter(job => job.status.includes('active')).length;
    const lengthtoCheckJob = jobs.filter(job => job.status.includes('toCheck')).length;
    const lengthArchiveJob = jobs.filter(job => job.status.includes('archived')).length;

    const [candidatures, setCandidatures] = useState<Candidature[]>([]);
    const [openModalCandidature, setOpenModalCandidature] = useState(false);
    const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
    const lengthCandidatures = candidatures.length;

    const [users, setUsers] = useState<User[]>([]);
    const [openModalUser, setOpenModalUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const lengthUsers = users.length;

    const [searchTermJobs, setSearchTermJobs] = useState("");
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTermJobs.toLowerCase())
    );
    const [searchTermCandidatures, setSearchTermCandidatures] = useState("");
    const filteredCandidatures = candidatures.filter(candidature =>
        candidature.title.toLowerCase().includes(searchTermCandidatures.toLowerCase())
    );
    const [searchTermUsers, setSearchTermUsers] = useState("");
    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTermUsers.toLowerCase()) &&
        user.lastName.toLowerCase().includes(searchTermUsers.toLowerCase())
    );

    const dataType: [string, number][] = [
        ["Employeur", 12],
        ["Chercheur d'emploi", 8]
    ];

    const dataPub: [string, number][] = [
        ["Jobs", lengthJob],
        ["Candidatures", lengthCandidatures]
    ];

    return (
        <div className="flex flex-col gap-6 px-10 py-8">
            <div>
                <h1 className="text-2xl font-bold text-black">
                    Pannel administrateur
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
                        <DashboardJobModal isOpen={openModalJob} setOpen={setOpenModalJob} job={selectedJob}/>
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
                                        <h1>
                                            title
                                            {/* {candidatures.title} */}
                                        </h1>
                                        <p>
                                            description
                                            {/* {candidatures.description} */}
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
                                        <h1>
                                            title
                                            {/* {user.title} */}
                                        </h1>
                                        <p>
                                            description
                                            {/* {user.description} */}
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