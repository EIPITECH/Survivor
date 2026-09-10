import Box from '@mui/material/Box';
import Button from './buttons/Button'

export default function Transparence () {
        return (
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
        </h2>

        Vous communiquer en toute transparence:        
        
        <h3>Les tarifs</h3>
        
        <p>
            L'application géoEmploi est entièrement gratuite, pour les employeurs comme pour les chercheurs d'emplois. Tout le monde peut consulter les offres d'emploi, tout personnes possédant un compte candidat (création gratuite) peut y postuler,  et toute personnes possédant un compte employeur (création gratuite) peut en poster de nouvelles.
        </p>
        
        
        <h3>La maille de localisation (précision)</h3>
        
        <p>
            Les offres d'emplois sont enregistré avec leur localisation, d'une précision communale (les offres sont regroupés par commune).
        </p>
        
        
        <h3>La durée de conservation des données</h3>
        
        <p>
            Les données personnelles utiles à la création de compte sont conservées jusqu'à suppression du compte. Les données de géolocalisation des utilisateurs ne sont pas stockées ; elles sont utilisées pour actualiser toutes les 10 secondes le marqueur de position sur la carte si l'utilisateur a activé l'outil de localisation. Il n'y a donc aucune trace de la position de l'utilisateur après fermeture ou rechargement de la page.
        </p>
        
        
        <h3>Contact</h3>
        
        <p>
          Contact délégué à la protection des données: Thibaut HIEN 06.12.34.56.78 thibaut.hien@jeb.com
        </p>

        <Button
          text="Retour"
          clickable={true}
          link="/"
          role="Retour page principal"
        />
        </Box>
        )
}