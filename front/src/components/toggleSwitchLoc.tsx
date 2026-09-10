import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Button from './buttons/Button';
import Cookies from 'js-cookie';

function getToken(): string | null {
  const tokenCookie = Cookies.get('token');

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

async function saveGeolocationConsent(granted: boolean): Promise<void> 
{
  const token = getToken();

  if (!token) {
    return;
  }
  const response = await fetch(
    'http://localhost:3000/consents/geolocation',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        granted,
      }),
    },
  );

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message ?? "Impossible d'enregistrer la décision de consentement");
  }
}


export function LocationModal({
  isOpen,
  onClose,
  onAccept,
  onRefuse,
  informationOnly = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onRefuse?: () => void;
  informationOnly?: boolean;
}) {

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="location-modal-title">
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
            color: '#FFA500',
            fontFamily: 'var(--font-stack)',
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
            fontFamily: 'var(--font-stack)',
            fontSize: '1.8rem',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          Géolocalisation de l'utilisateur
        </h2>
        
        <p style={{ color: '#6b665e', marginTop: '0.5rem' }}>
          Information préalable à l'activation
        </p>
        
        
        <h3>Finalité</h3>
        
        <p>
          Centrer automatiquement l'affichage de la carte des offres
          sur la position de l'utilisateur, à sa demande explicite.
        </p>
        
        
        <h3>Base légale</h3>
        
        <p>
          Consentement (art. 6.1.a du RGPD), recueilli via un toggle
          dédié précédé d'un texte d'information sur la finalité et
          l'absence de conservation.
        </p>
        
        
        <h3>Personnes concernées</h3>
        
        <p>
          Utilisateurs du site ayant activé le toggle de
          géolocalisation.
        </p>
        
        
        <h3>Catégorie de données</h3>
        
        <p>
          Coordonnées GPS (latitude/longitude) de l'utilisateur.
        </p>
        
        
        <h3>Destinataires</h3>
        
        <p>
          Aucun pour la position GPS elle-même.
          L'IGN (Géoplateforme) reçoit, via notre backend qui fait
          office de relais, les coordonnées de la zone de carte
          affichée, sans aucune information permettant
          d'identifier l'utilisateur.
        </p>
        
        
        <h3>Durée de conservation</h3>
        
        <p>
          Aucune, donnée effacée à la fermeture ou au
          rafraîchissement de la page.
        </p>
        
        
        <h3>Table / Colonne BDD</h3>
        
        <p>
          Aucune, la donnée GPS est transmise au serveur pour être
          instantanément envoyée à l'IGN afin de récupérer la tuile
          correspondante sans être stockée dans la BDD.
        </p>
        
        
        <h3>Ce qui n'est pas collecté</h3>
        
        <p>
          Coordonnées GPS en base de données, historique de
          déplacement, croisement position/identité, adresse IP
          à aucun niveau de la chaîne (pas de log HTTP global,
          pas de reverse proxy).
        </p>

        <div className="mt-8 flex justify-end gap-3">
          {informationOnly ? (
            <button
              type="button"
              onClick={onClose}
              className="
                cursor-pointer
                rounded-lg
                bg-[#FFA500]
                px-5
                py-3
                font-bold
                text-white
                hover:opacity-90
              "
            >
              Fermer
            </button>
          ):(
            <>
            <button
              type="button"
              onClick={onRefuse}
              className="
                cursor-pointer
                rounded-lg
                border
                border-gray-300
                px-5
                py-3
                font-semibold
                text-gray-700
                hover:bg-gray-100
              "
            >
              Refuser
            </button>

            <button
              type="button"
              onClick={onAccept}
              className="
                cursor-pointer
                rounded-lg
                bg-[#FFA500]
                px-5
                py-3
                font-bold
                text-white
                hover:opacity-90
              "
            >
              Accepter et activer
            </button>
        </>
        )}
        </div>
      </Box>
    </Modal>
  );
}



export default function SwitchLocation() {
  const [checked, setChecked] = useState(false);
  const [firstActivation, setFirstActivation] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const wantsLocation = event.target.checked;
    setError(null);
    if (wantsLocation) {
      setModalOpen(true);
      return;
    }
    setChecked(false);
    window.dispatchEvent(
      new CustomEvent('locationToggle', {
        detail: {
          enabled: false,
        },
      }),
    );
    saveGeolocationConsent(false).catch((error) => {
      console.error('Erreur consentement géolocalisation :', error);
    });};
    const handleAccept = async () => {
      setLoading(true);
      setError(null);

      try {
        await saveGeolocationConsent(true);
        setModalOpen(false);
        setChecked(true);
        window.dispatchEvent(
          new CustomEvent('locationToggle', {
            detail: {
              enabled: true,
            },
          }),
        );

      } catch (error) {
        console.error('Erreur consentement géolocalisation :', error);
        setError("Impossible d'enregistrer votre choix");
      } finally {
        setLoading(false);
      }
    };

    const handleRefuse = async () => {
      setChecked(false);
      setModalOpen(false);

      window.dispatchEvent(
        new CustomEvent('locationToggle', {
          detail: {
            enabled: false,
          },
        }),
      );

      try {
        await saveGeolocationConsent(false);
      } catch (err) {
        console.error('Erreur consentement géolocalisation :', err);
      }
    };

  return (
    <div className="flex items-center">
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            sx={{
              '& .MuiSwitch-switchBase': {
                color: '#9e9e9e',
              },
              '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                backgroundColor: '#9e9e9e',
                opacity: 0.5,
              },
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#FFA500',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#FFA500',
                opacity: 1,
              },
            }}
          />
        }
        label=""
      />
      <p>Localisation</p>
      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAccept={handleAccept}
        onRefuse={handleRefuse}
      />
      {loading && (
        <p className="ml-3 text-sm text-gray-500">
          Enregistrement...
        </p>
      )}
      {error && (
        <p className="ml-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
