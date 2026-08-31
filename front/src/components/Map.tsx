import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/global.css';
import LocationMarker from "./location"

export default function SurvivorMap() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          tema le popup
        </Popup>
      </Marker>
      <LocationMarker />
    </MapContainer>
  );
}