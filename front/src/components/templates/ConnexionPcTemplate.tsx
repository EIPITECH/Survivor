import { useState } from "react";
import Button from "../buttons/Button";
import Input from "../buttons/Input";

function ConnexionPcTemplate() {

    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     console.log('Bouton cliqué !');
    // };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log('Form :', {
            firstName,
            secondName,
            email,
            password
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-3 gap-10">
            {/* HEADER CONNEXION */}
            <div>
                <div className="flex justify-center">
                    Connexion
                </div>
            </div>

            {/* INPUT CONNEXION */}
            <div className="grid gap-6 mb-6">
                <div className="grid">
                    <label className="text-sm">Prénom</label>
                    <Input placeHolder="Alice" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}/>
                </div>
                <div className="grid">
                    <label className="text-sm">Nom</label>
                    <Input placeHolder="Duvillier"
                        value={secondName}
                        onChange={(e) => setSecondName(e.target.value)}/>
                </div>
                <div className="grid">
                    <label className="text-sm">Email</label>
                    <Input placeHolder="alice.duvillier@epitech.eu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="grid">
                    <label className="text-sm">Mot de passe</label>
                    <Input placeHolder="****"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </div>

            <div>
                <Button text="submit" clickable={true} type="submit"/>
            </div>
        </form>
    )
}

export default ConnexionPcTemplate;