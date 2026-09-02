import { useEffect, useState } from "react";
import Button from "../buttons/Button";
import Input from "../buttons/Input";
import Checkbox from "../buttons/Checkbox";
import Radio from "../buttons/Radio";

function CreationPcTemplate() {

    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [inscriptionType, setInscriptionType] = useState('');

    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     console.log('Bouton cliqué !');
    // };

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();

    //     console.log('Form :', {
    //         firstName,
    //         secondName,
    //         email,
    //         password
    //     });
    // };


    const handleSubmit = (event:any) =>  {
        event.preventDefault();

        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: secondName,
                email: email,
                password: password,
                role: inscriptionType
            }),
        }).then(() => {

        })
    }

    return (

        <div>

            {inscriptionType == '' && (
            // CHOIX INSCRIPTION
                <div>
                    <Button text="employeur" clickable={true} onClick={() => setInscriptionType('employer')}/>
                    <Button text="chercheur d'emploi" clickable={true} onClick={() => setInscriptionType('seeker')}/>
                </div>
            )}

            {inscriptionType == 'employer' && (
            // INSCRIPTION EMPLOYEUR
                <form onSubmit={handleSubmit} className="grid grid-3 gap-10">
                    {/* HEADER CONNEXION */}
                    <div>
                        <div className="flex justify-center">
                            Créer un compte (employeur)
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
            )}

            {inscriptionType == 'seeker' && (
            // INSCRIPTION CHERCHEUR D'EMPLOI
                <form onSubmit={handleSubmit} className="grid grid-3 gap-10">
                    {/* HEADER CONNEXION */}
                    <div>
                        <div className="flex justify-center">
                            Créer un compte (chercheur d'emploi)
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
                            <label className="text-sm">Genre</label>
                            <div className="flex gap-4">
                                <Radio label="Femme" name="gender"/>
                                <Radio label="Homme" name="gender"/>
                                <Radio label="Autre" name="gender"/>
                                <Radio label="Je ne souhaite pas répondre" name="gender"/>
                            </div>
                        </div>
                        <div className="grid">
                            <label className="text-sm">Compétences</label>
                            <Input placeHolder="Language C++, etc."
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
            )}

        </div>
    )
}

export default CreationPcTemplate;