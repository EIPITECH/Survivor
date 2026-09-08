import { Modal } from "@mui/material";
import modif from "../../assets/modif.png"
import poubelle from "../../assets/poubelle2.png"
import { useState, useEffect } from "react";
import Input from "../../components/buttons/Input"
import Radio from "../buttons/Radio";

interface Form {
    title: string,
    description: string,
    streetNumber: number,
    streetName: number
}

function DashboardJobModal({
    isOpen,
    setOpen,
    job
}:{
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    job: any
}) {

    const [formData, setFormData] = useState<Form>({
        title: job?.title ?? "",
        description: job?.description ?? "",
        streetNumber: job?.streetNumber ?? "",
        streetName: job?.streetName ?? ""
    });

    useEffect(() => {
        if (!isOpen) {
            setIsModif(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && job) {
            setFormData({
                title: job.title,
                description: job.description,
                streetNumber: job.streetNumber,
                streetName: job.streetName
            });
        }
    }, [isOpen, job?.id]);

    const [isModif, setIsModif] = useState(false);
    const [isSuppr, setIsSuppr] = useState(false);
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

    if (isSuppr == true) {
        return (
            <div className={`fixed inset-0 bg-black/25 z-50 flex items-center justify-center`}>
                <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] px-16 py-8 w-250 max-w-[90vw] max-h-[85vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}>

                    <div className="flex flex-col">
                        <div>
                            Voulez-vous vraiment supprimer cette offre ?
                        </div>
                        <div className="flex w-full justify-end gap-4">
                            <div className="bg-[#a0a0a0]/50 hover:cursor-pointer hover:bg-[#a0a0a0]/25 w-fit rounded-lg px-4 py-2"
                                onClick={() => setIsSuppr(false)}>
                                    Annuler
                            </div>
                            <div className="border-2 border-[#ff0000] hover:border-[#ff0000]/50 bg-[#ff0000]/10 hover:bg-[#ff0000]/5 hover:cursor-pointer w-fit rounded-lg px-4 py-2"
                                onClick={() => setOpen(false)}>
                                    Valider la suppresion
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div className={`fixed inset-0 bg-black/25 z-50 flex items-center justify-center`}
            onClick={handleClose}>
                <div className="bg-white rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.15)] px-16 py-8 w-250 max-w-[90vw] max-h-[85vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <div className={`justify-between ${isModif ? "flex-1" : "flex"}`}>

                                {isModif == true ?
                                (
                                    <div className="">
                                        <p>Titre:</p>
                                        <Input placeHolder="Titre" value={job.title} classInput={"w-full"}/>
                                    </div>
                                ):
                                (
                                    <h1 className="font-bold text-xl">
                                        {job.title}
                                    </h1>
                                )}

                                <div className="flex gap-4">
                                    {isModif == false &&
                                    <img onClick={() => setIsModif(true)} className="size-6 shrink-0 hover:cursor-pointer" src={modif.src} alt=""/>}
                                    {isModif == false && 
                                    <img onClick={() => setIsSuppr(true)} className="size-6 shrink-0 hover:cursor-pointer" src={poubelle.src} alt=""/>
                                    }
                                </div>
                            </div>

                            {isModif == true ?
                            (
                                <div>
                                    <p>Description:</p>
                                    <Input placeHolder="description" value={job.description} classInput={"w-full"} line="multi" rows={4}/>
                                </div>
                            ):
                            (
                                <div>
                                    {job.description}
                                </div>
                            )}
                        </div>
                        <div>
                            {isModif == true ? 
                            (
                                <div className="flex-1 gap-4">
                                    <div>
                                        <p>Numéro de la rue: </p>
                                        <Input placeHolder="12" value={job.streetNumber}/>
                                    </div>
                                    <div>
                                        <p>Nom de la rue: </p>
                                        <Input placeHolder="Avenue Aristide Briand" value={job.streetName} classInput={"w-full"}/>
                                    </div>
                                </div>
                            ):
                            (
                                <p>{job.streetNumber} {job.streetName}</p>
                            )}

                        </div>
                        <div className="flex flex-col justify-end mt-auto">
                            {isModif == true ?
                            (
                                <div>
                                    <p>Status:</p>
                                    <div className="flex flex-row gap-4">
                                        <Radio name="type" label="Actif"/>
                                        <Radio name="type" label="En cours de validation"/>
                                        <Radio name="type" label="Archivée"/>
                                    </div>
                                </div>
                            ):
                            (
                                <div>Status: {job.status}</div>
                            )}
                            <div>Score de confiance: {job.trustScore} / 1</div>
                            <div>Créé le: {date.format(new Date(job.createdAt))}</div>
                            <div>À: {time.format(new Date(job.createdAt))}</div>
                        </div>
                        {isModif == true && (
                            // AJOUTER LE FAITES QUE CA FAIT LA REQUETE POUR MODIFIER LE JOB
                            <div className="flex w-full justify-end gap-4">
                                <div className="bg-gray-300 hover:bg-gray-300/25 hover:cursor-pointer w-fit rounded-lg px-4 py-2"
                                    onClick={() => setIsModif(false)}>
                                        Annuler
                                </div>
                                <div className="bg-[#FFA500] hover:bg-[#FFA500]/50 hover:cursor-pointer w-fit rounded-lg px-4 py-2"
                                    onClick={() => setIsModif(false)}>
                                        Valider la modification
                                </div>
                            </div>
                        )}
                    </div>

                </div>
        </div>
    )
}

export default DashboardJobModal;