import { MapContainer, TileLayer, Marker, Popup, type MapContainerProps } from 'react-leaflet';
import '../styles/global.css';
import LocationMarker from "./location"
import MarkerRed from "./marker/markerRed"
import { useEffect, useState } from 'react';
import JobModal from './modal/jobModal';
import BurgerMenu from './BurgerMenu';
import { Control } from 'leaflet';
import { Map } from 'leaflet';

export default function ContainerSetterMap() {
  const [isOpen, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<item | null>(null);
  const handleOpenModal = (job: item) => {
    setSelectedJob(job);
    setOpen(true);
  };

  return (
    <>
      <JobModal
        isOpen={isOpen}
        setOpen={setOpen}
        title={selectedJob?.title || "Offre d'emploi"}
        description={selectedJob?.description || "Description non disponible"}
      />
      <SurvivorMap onOpenModal={handleOpenModal} />
    </>
  );
}

interface item {
  id: number,
  title: string,
  description: string,
  latitude: number,
  longitude: number,
  employerId:number,
  status: string,
  createdAt: string
}

export function SurvivorMap({ onOpenModal }: { onOpenModal: (job: item) => void }) {
  const [map, setMap] = useState();
  const [items, setItems] = useState<item[]>([]);
  const [refetch, setRefetch] = useState(false);

  const planIgnUrl = "http://localhost:3000/tiles/{z}/{x}/{y}";
   useEffect(() => {
       const fetchJobs = () => {
           fetch("http://localhost:3000/jobs", { cache: 'no-store' })
             .then((response) => {
               if (!response.ok) throw new Error(`HTTP ${response.status}`);
               return response.json();
             })
             .then((data) => {
               console.log("jobs data:", data);
               setItems(data);
             })
             .catch((err) => console.error("Failed to fetch jobs:", err));
         };
         fetchJobs();
         window.addEventListener('jobCreated', fetchJobs);
         return () => {
            window.removeEventListener('jobCreated', fetchJobs);
         };
    }, []);

  return (
    <MapContainer
      center={[48.8566, 2.3522]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ zIndex: '0', height: '100vh', width: '100%', overflow: 'hidden' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.ign.fr/">IGN France</a>'
        url={planIgnUrl}
      />
      {items.map((item) => (
        <MarkerRed
          key={item.id}
          pos={[item.latitude, item.longitude]}
          onClick={() => onOpenModal(item)} 
          description={item.title}
        />
      ))}
      <LocationMarker />
    </MapContainer>
  );
}

//        {items.map((item) => (<MarkerRed key={item.id} pos={[item.latitude, item.longitude]} setOpen={setOpen} description={item.description}
