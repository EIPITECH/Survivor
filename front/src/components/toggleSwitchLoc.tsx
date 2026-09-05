import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Button from './buttons/Button.tsx';

export function LocationModal({
  isOpen,
  handleCloseModal,
}: {
  isOpen: boolean;
  handleCloseModal: () => void;
}) {

  return (
    <Modal open={isOpen} onClose={handleCloseModal} aria-labelledby="location-modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          maxHeight: '85vh',
          overflowY: 'auto',
          bgcolor: '#fffdf8',
          border: '1px solid #e6e0d5',
          borderRadius: 3,
          boxShadow: '0 24px 70px rgba(41, 35, 27, 0.2)',
          p: { xs: 3, sm: 5 },
          '& h3': {
            color: '#1B3A6B',
            fontFamily: 'var(--font-marianne)',
            fontSize: '0.95rem',
            letterSpacing: '0.02em',
            margin: '1.5rem 0 0.35rem',
          },
          '& p': {
            color: '#514d47',
            fontFamily: 'var(--font-spectral)',
            fontSize: '1rem',
            lineHeight: 1.65,
            margin: 0,
          },
        }}
      >
        <h2
          id="location-modal-title"
          style={{
            color: '#1B3A6B',
            fontFamily: 'var(--font-marianne)',
            fontSize: '1.8rem',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
        </h2>

        <p style={{ color: '#6b665e', marginTop: '0.5rem' }}>
          Registre d'utilisation de la géolocalisation
        </p>

        <Box
          sx={{
            bgcolor: '#f1f4f8',
            borderLeft: '4px solid #1B3A6B',
            borderRadius: '0 8px 8px 0',
            marginTop: 3,
            padding: 2,
          }}
        >
          <p style={{ color: '#1B3A6B', fontSize: '0.98rem' }}>
            Vous allez activer la localisation pour centrer automatiquement la carte sur votre position. Cette donnée reste temporaire et n&apos;est pas conservée.
          </p>
        </Box>

        <h3>Nom du traitement</h3>
        <p>Géolocalisation de l'utilisateur pour centrage automatique de la carte interactive (GéoEmploi)</p>

        <h3>Finalité</h3>
        <p>Centrer automatiquement l'affichage de la carte des offres sur la position de l'utilisateur, à sa demande explicite</p>

        <h3>Base légale</h3>
        <p>Consentement (art. 6.1.a du RGPD), recueilli via un toggle dédié précédé d'un texte d'information sur la finalité et l'absence de conservation</p>

        <h3>Personnes concernées</h3>
        <p>Utilisateurs du site ayant activé le toggle de géolocalisation</p>

        <h3>Catégories de données</h3>
        <p>Coordonnées GPS (latitude/longitude) de l'utilisateur</p>

        <h3>Destinataires</h3>
        <p>Aucun pour la position GPS elle-même. L'IGN (Géoplateforme) reçoit, via notre backend qui fait office de relais, les coordonnées de la zone de carte affichée, sans aucune information permettant d'identifier l'utilisateur</p>

        <h3>Durée de conservation</h3>
        <p>Aucune, donnée effacée à la fermeture ou au rafraîchissement de la page</p>

        <h3>Table / Colonne BDD</h3>
        <p>Aucune, la donnée GPS est transmise au serveur pour être instantanément envoyée à l'IGN afin de récupérer la tuile correspondante sans être stockée dans la BDD</p>

        <h3>Ce qui n'est pas collecté</h3>
        <p>Coordonnées GPS en base de données, historique de déplacement, croisement position/identité, adresse IP à aucun niveau de la chaîne (pas de log HTTP global, pas de reverse proxy)</p>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
          <Button text="Fermer" onClick={handleCloseModal} type="button" clickable />
        </Box>

      </Box>
    </Modal>
  );
}



export default function SwitchLocation() {
  const [checked, setChecked] = useState(false);
  const [firstActivation, setFirstActivation] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;
    setChecked(isEnabled);
    if (isEnabled && !firstActivation) {
      setFirstActivation(true);
      setModalOpen(true);
    }
    window.dispatchEvent(
      new CustomEvent('locationToggle', { detail: { enabled: isEnabled } })
    );
  };

  return (
    <div className="flex items-center">
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label=""
      />
      <p>Localisation</p>
      <LocationModal
        isOpen={isModalOpen}
        handleCloseModal={() => setModalOpen(false)}
      />
    </div>
  );
}