import React, { useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import Button from "../buttons/Button";
import Input from "../buttons/Input";
import Cookies from 'js-cookie';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 550 },
  bgcolor: 'background.paper',
  border: '2px solid #1B3A6B',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto' as 'auto'
};

export default function CreateOfferModal({ isOpen, setOpen }: { isOpen: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [cityName, setCityName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const tokenCookie = Cookies.get('token');
    if (!tokenCookie) {
        setError("Vous devez être connecté en tant qu'employeur pour créer une offre.");
        return;
    }

    let token = '';
    try {
        const parsed = JSON.parse(tokenCookie);
        token = parsed.accessToken || tokenCookie;
    } catch (err) {
        token = tokenCookie;
    }

    const payload = {
        title: title.trim(),
        description: description.trim(),
        streetNumber: Number(streetNumber),
        streetName: streetName.trim(),
        cityName: cityName.trim(),
        zipCode: Number(zipCode),
        companyName: companyName.trim(),

    };

    try {
        const response = await fetch("http://localhost:3000/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            setSuccess(true);
            setTitle(''); setDescription(''); setStreetNumber(''); 
            setStreetName(''); setCityName(''); setZipCode(''); setCompanyName('');
            window.dispatchEvent(new Event('jobCreated'));
            setTimeout(() => {
                handleClose();
            }, 2000);
        } else {
            const resData = await response.json();
            setError(resData.message || "Erreur lors de la création de l'offre.");
        }
    } catch (err) {
        console.error(err);
        setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <Modal
      style={{ zIndex: '10001' }}
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="create-offer-modal-title"
    >
      <Box sx={style}>
        <Typography id="create-offer-modal-title" variant="h5" component="h2" color="#1B3A6B" className="text-center font-bold mb-6">
          Créer une offre d'emploi
        </Typography>

        {success ? (
            <div className="text-center text-green-600 font-bold my-10">
                L'offre a été publiée avec succès !
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {error && (
                    <div className="text-red-500 text-sm text-center italic">
                        {error}
                    </div>
                )}

                <div className="grid gap-2">
                    <label className="text-sm font-bold text-[#1B3A6B]">Titre de l'offre</label>
                    <Input placeHolder="Ex: Développeur FullStack" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-bold text-[#1B3A6B]">Description</label>                    <textarea 
                        className="bg-white border-2 border-black rounded-md px-2 py-2 outline-none transition-shadow duration-200 ease-out focus:border-[#1B3A6B] focus:ring focus:ring-[#1B3A6B] min-h-25"
                        placeholder="Détaillez les missions..." 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <label className="text-sm font-bold text-[#1B3A6B]">
                        Nom de l'entreprise
                    </label>
                            
                    <Input
                        placeHolder="Ex: NovaTech Solutions"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 grid gap-2">
                        <label className="text-sm font-bold text-[#1B3A6B]">N° de rue</label>
                        <Input placeHolder="Ex: 123" value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} />
                    </div>
                    <div className="col-span-2 grid gap-2">
                        <label className="text-sm font-bold text-[#1B3A6B]">Nom de la rue</label>
                        <Input placeHolder="Ex: Rue de la Paix" value={streetName} onChange={(e) => setStreetName(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-[#1B3A6B]">Code postal</label>
                        <Input placeHolder="Ex: 75000" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-bold text-[#1B3A6B]">Ville</label>
                        <Input placeHolder="Ex: Paris" value={cityName} onChange={(e) => setCityName(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={handleClose} className="text-gray-500 hover:text-gray-700 underline font-bold px-4">
                        Annuler
                    </button>
                    <Button text="Publier l'offre" clickable={true} type="submit" />
                </div>
            </form>
        )}
      </Box>
    </Modal>
  );
}