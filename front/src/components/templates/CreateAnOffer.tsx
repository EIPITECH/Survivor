import { useState } from "react";
import Button from "../buttons/Button";
import Input from "../buttons/Input";

function CreateAnOffer() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [streetName, setStreetName] = useState('');
    const [cityName, setCityName] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [employerId, setEmployerId] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const payload = {
            title: title.trim(),
            description: description.trim(),
            streetNumber: Number(streetNumber),
            streetName: streetName.trim(),
            cityName: cityName.trim(),
            zipCode: Number(zipCode),
            employerId: Number(employerId),
            status: "ACTIVE",
        };

        await fetch("http://localhost:3000/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(payload),
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="grid grid-3 gap-10">
                <div>
                    <div className="flex justify-center">
                        Créer une offre d'emploi
                    </div>
                </div>

                <div className="grid gap-6 mb-6">
                    <div className="grid">
                        <label className="text-sm">Titre de l'offre</label>
                        <Input
                            placeHolder="FullStack Developer"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid">
                        <label className="text-sm">Description de l'offre</label>
                        <Input
                            placeHolder="Your role is to create a web app which can do a lot of things"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid">
                        <label className="text-sm">Numéro de rue</label>
                        <Input
                            placeHolder="123"
                            value={streetNumber}
                            onChange={(e) => setStreetNumber(e.target.value)}
                        />
                    </div>
                    <div className="grid">
                        <label className="text-sm">Nom de rue</label>
                        <Input
                            placeHolder="Rue beau chatêau"
                            value={streetName}
                            onChange={(e) => setStreetName(e.target.value)}
                        />
                    </div>
                    <div className="grid">
                        <label className="text-sm">Ville</label>
                        <Input
                            placeHolder="Paris"
                            value={cityName}
                            onChange={(e) => setCityName(e.target.value)}
                        />
                    </div>
                    <div className="grid">
                        <label className="text-sm">Code postal</label>
                        <Input
                            placeHolder="75000"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </div>
                    <div className="grid">
                        <label className="text-sm">ID employeur</label>
                        <Input
                            placeHolder="123"
                            value={employerId}
                            onChange={(e) => setEmployerId(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <Button text="submit" clickable={true} type="submit" />
                </div>
            </form>
        </div>
    );
}

export default CreateAnOffer;