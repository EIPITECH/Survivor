import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../../styles/global.css';
import { useState } from 'react';
import iconPng from 'leaflet/dist/images/marker-icon-2x.png';

export default function MarkerRed(pos: [number, number], setOpen: React.Dispatch<React.SetStateAction<boolean>>, description: string) {
    var redIcon = L.icon({
        iconUrl: iconPng.src,
        iconSize:     [38, 95], // size of the icon
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    return (
        <Marker position={pos} icon={redIcon} eventHandlers={{ mouseover: (event) => event.target.openPopup(), mouseout: (event) => event.target.closePopup(), click: (event) => setOpen(true) }}>
            <Popup>
                {description}
            </Popup>    
        </Marker>
    );
}