
import poubelle from "../../assets/poubelle.png"
import croix from "../../assets/croix.png"
import verifier from "../../assets/verifier.png"
import { useEffect, useState } from "react";
import DashboardJobModal from "../modal/DashboardJobModal";

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

function DashboardPc() {

    const request = new Request("http://localhost:3000/jobs", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        // credentials: "include"
    })
    const [jobs, setJobs] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const okJob = ['active'];
    const toCheckJob = ['toCheck'];
    const archiveJob = ['archived']
    const lengthOkJob = jobs.filter(job => job.status.includes('active')).length;
    const lengthtoCheckJob = jobs.filter(job => job.status.includes('toCheck')).length;
    const lengthArchiveJob = jobs.filter(job => job.status.includes('archived')).length;

    useEffect(() => {
        async function getAllJobsByUser(request:Request) {
            try {
                const response = await fetch(request);
                const result = await response.json();

                if (response.ok) {
                    console.log("Get all jobs is success: ", result);
                    setJobs(result);
                } else {
                    console.error("Error de récupération des jobs: ", result);
                }
            } catch (error) {
                console.error("Error lors du fetch: ", error);
            }
        }

        getAllJobsByUser(request)
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
                    Candidatures (1)
                </h1>

                {/* 1 */}
                <div className="flex justify-between">
                    <div className="flex gap-2 px-5">
                        <div className="border border-[#1B3A6B]"></div>
                        <div>
                            <h1>
                                Développeur fullstack
                            </h1>
                            <p>
                                Jeanne Dupont
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <p>
                        voir la candidature ▾
                        </p>
                        <img className="size-5 shrink-0" src={verifier.src} alt=""/>
                        <img className="size-4 shrink-0" src={croix.src} alt=""/>
                        <img className="size-6 shrink-0 -translate-y-1" src={poubelle.src} alt=""/>
                    </div>
                </div>


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