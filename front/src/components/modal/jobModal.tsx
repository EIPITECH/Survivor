import * as React from "react";
import { Box, Modal } from "@mui/material";
import PostulateTemplate from "../templates/PostuleTemplate";
import { useState } from "react";
import Cookies from "js-cookie";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "88%",
    sm: 440,
  },
  bgcolor: "#ffffff",
  border: "1px solid #d8dde7",
  borderRadius: "14px",
  boxShadow: "0 18px 55px rgba(15, 31, 64, 0.22)",
  p: 0,
  overflow: "hidden",
};

const postulateStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "92%",
    sm: 520,
  },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "#ffffff",
  borderRadius: "14px",
  boxShadow: "0 18px 55px rgba(15, 31, 64, 0.22)",
  p: 4,
};

export default function JobModal({
  isOpen,
  setOpen,
  jobId,
  title,
  description,
  cityName,
  companyName,
  views
}: {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  jobId: number;
  title: string;
  description: string;
  cityName: string;
  companyName: string;
  views: number;
}) {
  const [statePostule, setOpenPostule] = useState(false);

  function getCurrentUserRole() {
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

      return payload.role ?? null;
    } catch {
      return null;
    }
  }

  const role = getCurrentUserRole();
  const canApply = role === "seeker";
  
  function handleClose() {
    setOpen(false);
  }

  function openPostule() {
    setOpenPostule(true);
  }

  function closePostule() {
    setOpenPostule(false);
  }

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="job-modal-title"
        aria-describedby="job-modal-description"
        sx={{
          zIndex: 1000,
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(15, 23, 42, 0.55)",
          },
        }}
      >
        <Box sx={modalStyle}>
          <div className="px-8 pt-8 pb-7">

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F1FF] flex items-center justify-center shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 7V5.5C8 4.67 8.67 4 9.5 4h5C15.33 4 16 4.67 16 5.5V7"
                    stroke="#FFA500"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <rect
                    x="4"
                    y="7"
                    width="16"
                    height="12"
                    rx="2"
                    stroke="#FFA500"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M4 11.5c2.2 1.4 4.9 2.1 8 2.1s5.8-.7 8-2.1"
                    stroke="#FFA500"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M10.8 13.3h2.4"
                    stroke="#FFA500"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h2
                  id="job-modal-title"
                  className="text-[26px] leading-tight font-bold text-[#1B3A6B]"
                >
                  {title}
                </h2>

                <div className="mt-4 flex flex-col gap-2 text-[15px]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-[#FFA500] ">▦</span>
                    <span className="font-medium text-black">{companyName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-black">
                    <span className="text-[#FFA500] text-lg">⌖</span>
                    <span>{cityName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-6 h-px bg-[#FFA500]" />

            {/* Description */}
            <p
              id="job-modal-description"
              className="text-[16px] leading-7 text-[#202637]"
            >
              {description}
            </p>

            <div className="my-6 h-px bg-[#FFA500]" />

            {/* Metadata */}
            <div className="flex flex-col gap-3 text-[15px] text-black">
              <div className="flex items-center gap-3">
                <span className="text-[#FFA500] text-lg">⌖</span>
                <span>
                  <strong>Localisation :</strong> {cityName}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#FFA500] text-lg">▦</span>
                <span>
                  <strong>Entreprise :</strong>{" "}
                  <span className="text-black">
                    {companyName}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#FFA500] text-lg">
                    ◉
                </span>
                <span>
                    <strong>Vues :</strong>{" "}
                    {views}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={openPostule}
              className={`
                mt-7
                w-full
                rounded-lg
                bg-[#FFA500]
                px-6
                py-4
                text-[20px]
                font-semibold
                text-black
                transition
                hover:cursor-pointer
                hover:bg-[#FFA500]/50
                
              `}

            >
              Postuler
            </button>

            <button
              type="button"
              className={`
                mt-7
                w-full
                rounded-lg
                bg-[#FF0000]
                px-6
                py-4
                text-[20px]
                font-semibold
                text-black
                transition
                hover:cursor-pointer
                
              `}

            >
              Signaler
            </button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={statePostule}
        onClose={closePostule}
        sx={{
          zIndex: 1100,
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(15, 23, 42, 0.6)",
          },
        }}
      >
        <Box sx={postulateStyle}>
          <h2 className="text-center text-2xl font-bold text-[#FFA500]">
            {title}
          </h2>

          <p className="mt-2 text-center text-gray-600">
            {companyName} — {cityName}
          </p>

          <div className="mt-6">
            <PostulateTemplate
              jobId={jobId}
              jobTitle={title}
              companyName={companyName}
              cityName={cityName}
              onClose={closePostule}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
}
