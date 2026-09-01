import { motion } from "framer-motion";

export default function CreateButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      style={{
        padding: "12px 24px",
        borderRadius: "8px",
        backgroundColor: "#0070f3",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Create New
    </motion.button>
  );
}