import React, { useEffect, useState } from "react";
import MobileTemplate from "./templates/MobileTemplate";
import PcTemplate from "./templates/PcTemplate";
import HeaderPc from "./templates/HeaderPc";
import HeaderMobile from "./templates/HeaderMobile";
import Cookies from "js-cookie";

type Props = {
    template: 'header' | 'template',
}

type UserRole = "seeker" | "employer" | "admin";


type ConnectedUser = {
    role: UserRole;
    firstName: string;
};

function getRoleFromToken(): ConnectedUser | null {
    const tokenCookie = Cookies.get("token");

    if (!tokenCookie) {
        return null;
    }

    let token = tokenCookie;
    try {
        const parsed = JSON.parse(tokenCookie);

        if (parsed.accessToken) {
            token = parsed.accessToken;
        }
    } catch {}

    try {
        const payloadPart = token.split(".")[1];

        if (!payloadPart) {
            return null;
        }
        const base64 = payloadPart
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const paddedBase64 = base64.padEnd(
            base64.length + (4 - (base64.length % 4)) % 4,
            "="
        );

        const payload = JSON.parse(atob(paddedBase64));

        if (payload.exp && payload.exp * 1000 < Date.now()) {
            Cookies.remove("token");
            return null;
        }

        if (
            payload.role !== "seeker" &&
            payload.role !== "employer" &&
            payload.role !== "admin"
        ) {
            return null;
        }

        return {role: payload.role, firstName: payload.firstName};
    } catch (error) {
        console.error("Impossible de décoder le token:", error);
        return null;
    }
}

function ChooseDevice({
    template
}: Props) {
    const [width, setWidth] = useState<number>(window.innerWidth);

    const [user] = useState<ConnectedUser | null>(() => {
        return getRoleFromToken();
    });

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange);

        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    const isMobile = width <= 768;

    if (template === "header") {
        return isMobile
            ? <HeaderMobile role={user?.role ?? null} firstName={user?.firstName ?? null} />
            : <HeaderPc role={user?.role ?? null} firstName={user?.firstName ?? null} />;
    }

    return (
        <div>
            {isMobile ? <MobileTemplate /> : <PcTemplate />}
        </div>
    );
}

export default ChooseDevice;