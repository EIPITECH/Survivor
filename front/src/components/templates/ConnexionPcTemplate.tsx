import { useState } from "react";
import Button from "../buttons/Button";
import Input from "../buttons/Input";

function ConnexionPcTemplate() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     console.log('Bouton cliqué !');
    // };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log('Form :', {
            email,
            password
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-4 gap-10">
            {/* HEADER CONNEXION */}
            <div>
                <div className="flex justify-center">
                    Connexion
                </div>
            </div>

            {/* INPUT CONNEXION */}
            <div className="grid gap-6 mb-6">
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

            <div className="flex gap-1">
                <p>Pas encore de compte ?</p>
                <a href="/inscription/" className="group text-sky-600 transition duration-300">
                    Créer un compte
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-sky-600"></span>
                </a>
            </div>

            <div>
                <Button text="submit" clickable={true} type="submit"/>
            </div>
        </form>
    )
}



export default ConnexionPcTemplate;