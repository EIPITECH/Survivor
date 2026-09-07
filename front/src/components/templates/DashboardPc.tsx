
import croix from "../../assets/croix.png"
import verifier from "../../assets/verifier.png"
import { useEffect, useState } from "react";
import DashboardJobModal from "../modal/DashboardJobModal";
import Cookies from 'js-cookie'

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
    const [open, setOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const okJob = ['active'];
    const toCheckJob = ['toCheck'];
    const archiveJob = ['archived']
    const lengthOkJob = jobs.filter(job => job.status.includes('active')).length;
    const lengthtoCheckJob = jobs.filter(job => job.status.includes('toCheck')).length;
    const lengthArchiveJob = jobs.filter(job => job.status.includes('archived')).length;

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

    const handleJobSelection = (job: Job) => {
        setSelectedJob(job);
        setOpen(true);
    }

    return (
        <div className="flex flex-col gap-6 px-10 py-8">
            <div>
                <h1 className="text-2xl font-bold text-black">
                    Tableau de bord
                </h1>
            </div>

            {/* <div className="flex gap-4">
                <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex-1">
                </div>
                <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex-1">
                </div>
            </div> */}

            <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] p-6 flex flex-col gap-4">

                <h1 className="text-xl font-bold text-black">
                    Candidatures ({applications.length})
                </h1>
                    {applications.length === 0 ? (
        <p className="text-gray-500">
            Aucune candidature reçue.
        </p>
    ) : (
        applications.map((application) => (
            <div
                key={application.id}
                className="flex justify-between rounded-lg px-2 py-3 hover:bg-gray-100"
            >
                <div className="flex gap-2 px-5">
                    <div className="border border-[#1B3A6B]"></div>

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
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <p className="cursor-pointer">
                        voir la candidature ▾
                    </p>

                    <img
                        className="size-5 shrink-0"
                        src={verifier.src}
                        alt="Accepter"
                    />

                    <img
                        className="size-4 shrink-0"
                        src={croix.src}
                        alt="Refuser"
                    />
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
        </div>
    )
}

export default DashboardPc;