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
  onAccept,
  onRefuse,
}: {
  isOpen: boolean;
  onAccept: () => void;
  onRefuse: () => void;
}) {

  return (
    <Modal open={isOpen} onClose={onRefuse} aria-labelledby="location-modal-title">
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
          Utilisation de votre localisation
        </h2>

        <p style={{ color: '#6b665e', marginTop: '0.5rem' }}>
            Information préalable à l'activation
        </p>

        <Box
          sx={{
            bgcolor: '#f1f4f8',
            borderLeft: '4px solid #FFA500',
            borderRadius: '0 8px 8px 0',
            marginTop: 3,
            padding: 2,
          }}
        >
          <p style={{ color: '#FFA500', fontSize: '0.98rem' }}>
            GéoEmploi peut utiliser temporairement
            votre position afin de vous localiser sur
            la carte. Vos coordonnées GPS ne sont pas
            enregistrées dans notre base de données et
            aucun historique de localisation n'est
            constitué.
          </p>
        </Box>
          
        <h3>Finalité</h3>

        <p>Utiliser votre position actuelle afin de
          faciliter la consultation de la carte des
          offres d'emploi.</p>

        <h3>Données utilisées</h3>
        <p> Coordonnées géographiques fournies par votre navigateur : latitude et longitude.</p>

        <h3>Conservation</h3>
        <p>Aucune conservation de votre position. Elle
          est utilisée temporairement dans votre
          navigateur et n'est pas enregistrée dans la
          base de données de GéoEmploi.</p>

        <h3>Historique de localisation</h3>
        <p>Aucun historique de déplacement ou de localisation n'est constitué.</p>

        <h3>Trace de votre décision</h3>
        <p>Si vous êtes connecté, GéoEmploi conserve
          uniquement la trace de votre décision, sa date
          et la version de cette notice. Cette trace ne
          contient aucune coordonnée géographique.</p>

        <div className="mt-8 flex justify-end gap-3">

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
