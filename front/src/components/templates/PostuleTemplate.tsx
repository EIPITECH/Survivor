import { useState } from "react";
import Cookies  from 'js-cookie'

export default function PostulateTemplate({
    jobId,
    jobTitle,
    companyName,
    cityName,
    onClose,
}: {
    jobId: number;
    jobTitle: string;
    companyName: string;
    cityName: string;
    onClose?: () => void;
}) {
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function getToken() {
        const tokenCookie = Cookies.get("token");

        if (!tokenCookie) {
          return null;
        }

        try {
          const parsed = JSON.parse(tokenCookie);

          return parsed.accessToken || tokenCookie;
        } catch {
          return tokenCookie;
        }
    }
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const token = getToken();

        if (!token) {
          setError("Vous devez être connecté pour postuler.");
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(
            "http://localhost:3000/applications",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                jobId: jobId,
                message: message.trim(),
              }),
            }
          );

          if (!response.ok) {
            const data = await response.json();

            const errorMessage = Array.isArray(data.message)
              ? data.message.join(", ")
              : data.message || "Erreur lors de la candidature.";

            setError(errorMessage);
            setLoading(false);
            return;
          }

          setSuccess(true);
        } catch (err) {
          console.error(err);

          setError(
            "Impossible de contacter le serveur."
          );
        } finally {
          setLoading(false);
        }
      }

    if (success) {
        return (
            <div className="flex flex-col items-center gap-5 py-8 text-center">
                <div className="
                    flex h-16 w-16
                    items-center justify-center
                    rounded-full
                    bg-green-100
                    text-3xl
                    text-green-700
                ">
                    ✓
                </div>

                <div>
                    <h3 className="text-2xl font-bold text-[#1B3A6B]">
                        Candidature envoyée
                    </h3>

                    <p className="mt-2 text-gray-600">
                        Votre candidature pour
                        <strong> {jobTitle}</strong> a bien été prise en compte.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        rounded-lg
                        bg-[#2C5DB3]
                        px-8
                        py-3
                        font-semibold
                        text-white
                        hover:bg-[#214A91]
                    "
                >
                    Retour aux offres
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
        >
            <div>
                <h3 className="text-2xl font-bold text-[#1B3A6B]">
                    Candidater
                </h3>

                <p className="mt-2 text-gray-600">
                    {jobTitle}
                </p>

                <p className="text-sm text-[#2C5DB3]">
                    {companyName} — {cityName}
                </p>
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="application-message"
                    className="font-semibold text-[#1B3A6B]"
                >
                    Message à l'employeur
                </label>

                <textarea
                    id="application-message"
                    value={message}
                    onChange={(event) =>
                        setMessage(event.target.value)
                    }
                    placeholder="Présentez brièvement votre motivation..."
                    required
                    rows={6}
                    className="
                        resize-none
                        rounded-lg
                        border
                        border-gray-300
                        p-3
                        outline-none
                        focus:border-[#2C5DB3]
                    "
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`
                    w-full
                    rounded-lg
                    bg-[#2C5DB3]
                    px-6
                    py-4
                    text-lg
                    font-semibold
                    text-white
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#2C5DB3] hover:bg-[#214A91]"
                    }
                `}
            >
                {loading
                    ? "Envoi en cours..."
                    : "Envoyer ma candidature"}
                </button>
        </form>
    );
}
