import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface CityMarkerProps {
    pos: [number, number];
    cityName: string;
    count: number;
    onClick: () => void;
}

export default function CityMarker({
    pos,
    cityName,
    count,
    onClick,
}: CityMarkerProps) {

    const cityIcon = L.divIcon({
        className: "",
        html: `
            <div
                style="
                    position: relative;
                    width: 44px;
                    height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                "
            >
                <div
                    style="
                        width: 38px;
                        height: 38px;
                        background: #FFA500;
                        border: 3px solid white;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        box-shadow: 0 3px 8px rgba(0,0,0,0.35);
                    "
                >
                </div>

                <div
                    style="
                        position: absolute;
                        top: -7px;
                        right: -7px;
                        min-width: 24px;
                        height: 24px;
                        padding: 0 6px;
                        background: #1B3A6B;
                        color: white;
                        border: 2px solid white;
                        border-radius: 999px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: bold;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.25);
                    "
                >
                    ${count}
                </div>
            </div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 44],
        popupAnchor: [0, -45],
    });

    return (
        <Marker
            position={pos}
            icon={cityIcon}
            eventHandlers={{
                click: onClick,
            }}
        >
        </Marker>
    );
}
