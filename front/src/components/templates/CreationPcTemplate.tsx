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
    const [errorInscription, setErrorInscription] = useState(false);

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
        }).then((response) => {
            if (response.ok) {
                window.location.href = "/";
            } else {
                console.error("Erreur création du compte.");
                setErrorInscription(true);
            }
        }).catch((error) => {
            console.error("Error:", error);
        })
    }

    return (

        <div>

            {inscriptionType == '' && (
            // CHOIX INSCRIPTION
                <div className="min-h-screen flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-10 w-full max-w-xl shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                        <div className="flex flex-col items-center gap-4">
                            <Button text="Candidat" clickable={true} onClick={() => setInscriptionType('seeker')}/>
                            <Button text="Employeur" clickable={true} onClick={() => setInscriptionType('employer')}/>
                        </div>
                    </div>
                </div>
            )}

            {inscriptionType == 'employer' && (
                // INSCRIPTION EMPLOYEUR
                <div className="min-h-screen flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-10 w-full max-w-xl shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                        <form onSubmit={handleSubmit} className="max-w-md w-full grid gap-10">
                            {/* HEADER INSCRIPTION */}
                            <div className="flex justify-center items-center">
                                <h1 className="flex justify-center font-bold text-xl">
                                    Créer un compte (employeur)
                                </h1>
                            </div>

                            <div className="flex justify-center text-gray-500">
                                <p className="italic">Tous les champs sont obligatoires</p>
                            </div>

                            {errorInscription == true &&
                                <div className="flex justify-center text-red-500">
                                    <p className="italic">Erreur lors de la création du compte !</p>
                                </div>
                            }

                            {/* INPUT INSCRIPTION */}
                            <div className="grid gap-6 mb-6">
                                <div className="grid gap-2">
                                    <label className="text-lg font-bold">Prénom</label>
                                    <Input placeHolder="Jean"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}/>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-lg font-bold">Nom</label>
                                    <Input placeHolder="Dupont"
                                        value={secondName}
                                        onChange={(e) => setSecondName(e.target.value)}/>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-lg font-bold">Email</label>
                                    <Input placeHolder="jean.dupon@email.fr"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-lg font-bold">Mot de passe</label>
                                    <Input placeHolder="***********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button text="Créer mon compte" clickable={true} type="submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {inscriptionType == 'seeker' && (
                // INSCRIPTION CHERCHEUR D'EMPLOI
                <div className="min-h-screen flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-10 w-full max-w-xl shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                        <form onSubmit={handleSubmit} className="max-w-md w-full grid gap-10">
                            {/* HEADER INSCRIPTION */}
                            <div className="flex justify-center items-center">
                                <h1 className="flex justify-center font-bold text-xl">
                                    Créer un compte (candidat)
                                </h1>
                            </div>

                            <div className="flex justify-center text-gray-500">
                                <p className="italic">Tous les champs sont obligatoires</p>
                            </div>

                            {errorInscription == true &&
                                <div className="flex justify-center text-red-500">
                                    <p className="italic">erreur création du compte !</p>
                                </div>
                            }

                            {/* INPUT INSCRIPTION */}
                            <div className="grid gap-6 mb-6">
                                <div className="grid gap-2">
                                    <label className="text-lg font-bold">Prénom</label>
                                    <Input placeHolder="Jean"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}/>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-lg font-bold">Nom</label>
                                    <Input placeHolder="Dupont"
                                        value={secondName}
                                        onChange={(e) => setSecondName(e.target.value)}/>
                                </div>
                                {/* <div className="grid gap-2">
                                    <label className="text-lg font-bold">Genre</label>
                                    <div className="flex gap-4">
                                        <Radio label="Femme" name="gender"/>
                                        <Radio label="Homme" name="gender"/>
                                        <Radio label="Autre" name="gender"/>
                                        <Radio label="Je ne souhaite pas répondre" name="gender"/>
                                    </div>
                                </div> */}
                                {/* <div className="grid gap-2">
                                    <label className="text-lg font-bold">Compétences</label>
                                    <Input placeHolder="Language C++, etc."
                                        value={secondName}
                                        onChange={(e) => setSecondName(e.target.value)}/>
                                </div> */}
                                <div className="grid gap-2">
                                    <label className="text-lg font-bold">Email</label>
                                    <Input placeHolder="jean.dupont@epitech.eu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-lg font-bold">Mot de passe</label>
                                    <Input placeHolder="***********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <Button text="Créer mon compte" clickable={true} type="submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

export default CreationPcTemplate;