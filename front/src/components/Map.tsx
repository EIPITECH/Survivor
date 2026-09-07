import { MapContainer, TileLayer, Marker, Popup, type MapContainerProps } from 'react-leaflet';
import LocationMarker from "./location"
import MarkerRed from "./marker/markerRed"
import { useEffect, useState } from 'react';
import JobModal from './modal/jobModal';
import BurgerMenu from './BurgerMenu';
import { Control } from 'leaflet';
import { Map } from 'leaflet';
import CityMarker from "./marker/cityMarker";
import CityJobsPanel from "./map/cityJobPanel";
import type { Job, CityGroup } from "../types/job";

export default function ContainerSetterMap() {
    const [isOpen, setOpen] = useState(false);

    const [selectedJob, setSelectedJob] =
        useState<Job | null>(null);

    const handleOpenModal = (job: Job) => {
        setSelectedJob(job);
        setOpen(true);
    };

    return (
        <>
            <JobModal
                isOpen={isOpen}
                setOpen={setOpen}
                jobId={selectedJob?.id ?? 0}
                title={
                    selectedJob?.title ||
                    "Offre d'emploi"
                }
                description={
                    selectedJob?.description ||
                    "Description non disponible"
                }
                cityName={
                    selectedJob?.cityName ||
                    "Localisation non renseignée"
                }
                companyName={
                    selectedJob?.companyName ||
                    "Nom de l'entreprise non renseignée"
                }
            />

            <SurvivorMap
                onOpenModal={handleOpenModal}
            />
        </>
    );
}

export function SurvivorMap({
    onOpenModal,
}: {
    onOpenModal: (job: Job) => void;
}) {
    const [groups, setGroups] =
        useState<CityGroup[]>([]);

    const [selectedGroup, setSelectedGroup] =
        useState<CityGroup | null>(null);

    const planIgnUrl =
        "http://localhost:3000/tiles/{z}/{x}/{y}";

    useEffect(() => {
        const fetchJobs = () => {
            fetch(
                "http://localhost:3000/jobs/active/grouped",
                {
                    cache: "no-store",
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP ${response.status}`
                        );
                    }

                    return response.json();
                })
                .then((data: CityGroup[]) => {
                    console.log(
                        "Grouped jobs:",
                        data
                    );

                    setGroups(data);
                })
                .catch((err) =>
                    console.error(
                        "Failed to fetch grouped jobs:",
                        err
                    )
                );
        };

        fetchJobs();

        window.addEventListener(
            "jobCreated",
            fetchJobs
        );

        return () => {
            window.removeEventListener(
                "jobCreated",
                fetchJobs
            );
        };
    }, []);

    return (
        <div className="relative h-screen w-full">

            <MapContainer
                center={[48.8566, 2.3522]}
                zoom={13}
                scrollWheelZoom={true}
                style={{
                    zIndex: "0",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.ign.fr/">IGN France</a>'
                    url={planIgnUrl}
                />

                {groups.map((group) => (
                    <CityMarker
                        key={group.cityName}
                        pos={[
                            group.latitude,
                            group.longitude,
                        ]}
                        cityName={group.cityName}
                        count={group.count}
                        onClick={() =>
                            setSelectedGroup(group)
                        }
                    />
                ))}

                <LocationMarker />

            </MapContainer>

            <CityJobsPanel
                group={selectedGroup}
                onClose={() =>
                    setSelectedGroup(null)
                }
                onOpenJob={(job) => {
                    setSelectedGroup(null);
                    onOpenModal(job);
                }}
            />

        </div>
    );
}

//        {items.map((item) => (<MarkerRed key={item.id} pos={[item.latitude, item.longitude]} setOpen={setOpen} description={item.description}
