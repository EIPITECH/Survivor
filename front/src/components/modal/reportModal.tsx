import * as React from "react";
import { Box, Modal } from "@mui/material";
import { useState } from "react";
import Cookies from "js-cookie";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: 500,
  },
  bgcolor: "#ffffff",
  borderRadius: "14px",
  boxShadow: "0 18px 55px rgba(15, 31, 64, 0.25)",
  p: 4,
};

interface ReportModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  jobId: number;
  jobTitle: string;
}

export default function ReportModal({
  isOpen,
  setOpen,
  jobId,
  jobTitle,
}: ReportModalProps) {
  const [reason, setReason] = useState("fraud");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    if (loading) {
      return;
    }

    setOpen(false);

    setTimeout(() => {
      setReason("fraud");
      setMessage("");
      setSuccess(false);
      setError("");
    }, 200);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);
    const token = Cookies.get("access_token");

    if (!token) {
        setError("Vous devez être connecté avec un compte candidat pour signaler une offre");
        setLoading(false);
        return;
    }
    
    try {
      const response = await fetch("http://localhost:3000/reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobId,
            reason,
            message: message.trim() || undefined,
          }),
        });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Impossible d'envoyer le signalement"
        );
      }

      setSuccess(true);
      setMessage("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="report-modal-title"
      sx={{
        zIndex: 1200,
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(15, 23, 42, 0.65)",
        },
      }}
    >
      <Box sx={modalStyle}>
        {!success ? (
          <form onSubmit={handleSubmit}>
            <h2
              id="report-modal-title"
              className="text-2xl font-bold text-[#1B3A6B]"
            >
              Signaler une offre
            </h2>

            <p className="mt-2 text-gray-600">
              Vous souhaitez signaler :
            </p>

            <p className="mt-1 font-semibold text-black">
              {jobTitle}
            </p>

            <div className="my-5 h-px bg-[#FFA500]" />

            <label
              htmlFor="report-reason"
              className="block font-semibold text-black mb-2"
            >
              Motif du signalement
            </label>

            <select
              id="report-reason"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-black
                outline-none
                focus:border-[#1B3A6B]
              "
            >
              <option value="fraud">
                Offre frauduleuse
              </option>

              <option value="misleading">
                Informations trompeuses
              </option>

              <option value="inappropriate">
                Contenu inapproprié
              </option>

              <option value="expired">
                Offre expirée
              </option>

              <option value="other">
                Autre
              </option>
            </select>

            <label
              htmlFor="report-message"
              className="block font-semibold text-black mt-5 mb-2"
            >
              Informations complémentaires
            </label>

            <textarea
              id="report-message"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              maxLength={1000}
              rows={5}
              placeholder="Décrivez le problème rencontré..."
              className="
                w-full
                resize-none
                rounded-lg
                border
                border-gray-300
                px-4
                py-3
                text-black
                outline-none
                focus:border-[#1B3A6B]
              "
            />

            <div className="mt-1 text-right text-sm text-gray-500">
              {message.length}/1000
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-4
                  py-3
                  font-semibold
                  text-black
                  hover:cursor-pointer
                  hover:bg-gray-100
                  disabled:opacity-50
                "
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  bg-red-600
                  px-4
                  py-3
                  font-semibold
                  text-white
                  hover:cursor-pointer
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Envoi..."
                  : "Envoyer le signalement"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-5xl">
              ✓
            </div>

            <h2 className="mt-4 text-2xl font-bold text-[#1B3A6B]">
              Signalement envoyé
            </h2>

            <p className="mt-3 text-gray-600">
              Merci. Votre signalement a bien été transmis à
              l'administration.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="
                mt-6
                w-full
                rounded-lg
                bg-[#1B3A6B]
                px-4
                py-3
                font-semibold
                text-white
                hover:cursor-pointer
              "
            >
              Fermer
            </button>
          </div>
        )}
      </Box>
    </Modal>
  );
}
