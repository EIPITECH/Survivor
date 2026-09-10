import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

type Notification = {
    id: number;
    type: string;
    title: string;
    message: string;
    applicationId: number | null;
    isRead: boolean;
    createdAt: string;
};

type Props = {
    variant?: "header" | "dashboard";
};

function getToken(): string | null {
    const tokenCookie = Cookies.get("token");

    if (!tokenCookie) {
        return null;
    }

    try {
        const parsedToken = JSON.parse(tokenCookie);

        return parsedToken.accessToken ?? tokenCookie;
    } catch {
        return tokenCookie;
    }
}

function formatDate(date: string) {
    return new Date(date).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function EmployerNotifications({variant = "header"}: Props) 
{
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(true);

    const unreadCount = useMemo(
        () =>
            notifications.filter(
                notification => !notification.isRead
            ).length,
        [notifications]
    );

    async function loadNotifications() {
        const token = getToken();

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                console.error("Erreur récupération notifications");
                return;
            }

            const data = await response.json();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur récupération notifications :", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadNotifications();
        const interval = window.setInterval(loadNotifications, 10000);
        return () =>
            window.clearInterval(interval);
    }, []);

    async function markAsRead(notificationId: number) 
    {
        const notification = notifications.find(item => item.id === notificationId);

        if (!notification || notification.isRead) {
            return;
        }

        const token = getToken();

        if (!token) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/notifications/${notificationId}/read`,
                {
                    method: "PATCH",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                return;
            }

            setNotifications(
                current =>
                    current.map(item =>
                        item.id === notificationId
                            ? {
                                  ...item,
                                  isRead: true,
                              }
                            : item
                    )
            );
        } catch (error) {
            console.error("Erreur lecture notification :", error);
        }
    }

    async function markAllAsRead() {
        const token = getToken();

        if (!token || unreadCount === 0) {
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/notifications/read-all",
                {
                    method: "PATCH",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                return;
            }

            setNotifications(
                current =>
                    current.map(item => ({
                        ...item,
                        isRead: true,
                    }))
            );
        } catch (error) {
            console.error("Erreur lecture notifications :", error);
        }
    }

    const notificationList = (
        <div className="max-h-96 overflow-y-auto">

            {loading ? (

                <p className="px-4 py-5 text-sm text-gray-500">
                    Chargement des notifications...
                </p>

            ) : notifications.length === 0 ? (

                <p className="px-4 py-5 text-sm text-gray-500">
                    Aucune notification pour le moment.
                </p>

            ) : (

                notifications.map(
                    notification => (

                        <button
                            key={notification.id}
                            type="button"

                            onClick={() =>
                                markAsRead(notification.id)
                            }

                            className={`
                                block
                                w-full
                                border-b
                                border-gray-100
                                px-4
                                py-4
                                text-left
                                transition-colors
                                hover:bg-gray-50
                                ${
                                    notification.isRead
                                        ? "bg-white"
                                        : "bg-orange-50"
                                }
                            `}
                        >

                            <div className="flex items-start gap-3">

                                <span
                                    className={`
                                        mt-2
                                        h-2.5
                                        w-2.5
                                        shrink-0
                                        rounded-full
                                        ${
                                            notification.isRead
                                                ? "bg-gray-300"
                                                : "bg-[#FFA500]"
                                        }
                                    `}
                                />

                                <div className="min-w-0">

                                    <p className="font-semibold text-black">
                                        {notification.title}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                        {notification.message}
                                    </p>

                                    <p className="mt-2 text-xs text-gray-400">
                                        {formatDate(notification.createdAt)}
                                    </p>

                                </div>
                            </div>
                        </button>
                    )
                )
            )}

        </div>
    );

    if (variant === "dashboard") {
        return (
            <section
                className="
                    rounded-2xl
                    bg-white
                    p-6
                    shadow-[0_0_25px_rgba(0,0,0,0.15)]
                "
            >
                <div
                    className="
                        mb-4
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    <div>

                        <h2 className="text-xl font-bold text-black">
                            Notifications
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {unreadCount > 0
                                ? `${unreadCount} notification${
                                      unreadCount > 1
                                          ? "s"
                                          : ""
                                  } non lue${
                                      unreadCount > 1
                                          ? "s"
                                          : ""
                                  }`
                                : "Vous êtes à jour"}
                        </p>

                    </div>

                    {unreadCount > 0 && (

                        <button
                            type="button"
                            onClick={markAllAsRead}

                            className="
                                cursor-pointer
                                rounded-lg
                                border
                                border-[#1B3A6B]
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-[#1B3A6B]
                                hover:bg-gray-50
                            "
                        >
                            Tout marquer comme lu
                        </button>
                    )}

                </div>

                <div
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-200
                    "
                >
                    {notificationList}
                </div>
            </section>
        );
    }

    return (
        <div className="relative">

            <button
                type="button"

                onClick={() =>
                    setIsOpen(open => !open)
                }

                className="
                    relative
                    flex
                    h-12
                    w-12
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    text-[#1B3A6B]
                    shadow-sm
                    transition-colors
                    hover:bg-gray-100
                "

                aria-label="Notifications"
            >

                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {unreadCount > 0 && (

                    <span
                        className="
                            absolute
                            -right-1
                            -top-1
                            flex
                            min-h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            bg-[#FFA500]
                            px-1
                            text-xs
                            font-bold
                            text-black
                            ring-2
                            ring-white
                        "
                    >
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}

            </button>

            {isOpen && (

                <div
                    className="
                        absolute
                        right-0
                        top-full
                        z-[3000]
                        mt-3
                        w-[min(24rem,calc(100vw-2rem))]
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        shadow-2xl
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-gray-200
                            px-4
                            py-3
                        "
                    >

                        <div>

                            <p className="font-bold text-black">
                                Notifications
                            </p>

                            <p className="text-xs text-gray-500">
                                {unreadCount > 0
                                    ? `${unreadCount} non lue${
                                          unreadCount > 1
                                              ? "s"
                                              : ""
                                      }`
                                    : "Aucune nouvelle notification"}
                            </p>

                        </div>

                        {unreadCount > 0 && (

                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="
                                    cursor-pointer
                                    text-xs
                                    font-semibold
                                    text-[#1B3A6B]
                                    hover:underline
                                "
                            >
                                Tout lire
                            </button>
                        )}

                    </div>

                    {notificationList}

                </div>
            )}

        </div>
    );
}
