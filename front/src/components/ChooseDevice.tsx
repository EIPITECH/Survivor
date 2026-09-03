import React, { useEffect, useState } from "react";
import MobileTemplate from "./templates/MobileTemplate";
import PcTemplate from "./templates/PcTemplate";
import HeaderPc from "./templates/HeaderPc";
import HeaderMobile from "./templates/HeaderMobile";

type Props = {
    template: 'header' | 'template',
}

function ChooseDevice({
    template
}: Props) {
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

    if (template === 'header') {
        return isMobile ? <HeaderMobile /> : <HeaderPc/>;
    } else {
        return (
            <div>
                {isMobile ? <MobileTemplate/> : <PcTemplate/>}
            </div>
        );
    }

}

export default ChooseDevice;
