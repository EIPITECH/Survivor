import React, { useEffect, useState } from "react";
import MobileTemplate from "./templates/MobileTemplate";
import PcTemplate from "./templates/PcTemplate";

function ChooseDevice() {
    const [width, setWidth] = useState<number>(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    const isMobile = width <= 768;

    return (
        <div>
            {isMobile ? <MobileTemplate /> : <PcTemplate />}
        </div>
    );
}

export default ChooseDevice;
