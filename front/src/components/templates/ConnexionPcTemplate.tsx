import { useState } from "react";
import Button from "../buttons/Button";
import Input from "../buttons/Input";
import LogoJeb from "../../assets/logoJEB.png";
import Cookies from 'js-cookie';

async function connectionUser(request:Request, setToken:any, setErrorConnection:any) {
    try {
        const response = await fetch(request);
        const result = await response.json();

        if (response.ok) {
            console.log("Success: ", result);
            setToken(result);
            Cookies.set('token', typeof result === 'string' ? result : JSON.stringify(result), { expires: 7, secure: true });
            window.location.href = "/";
        } else {
            console.error("Erreur de connexion: ", result);
            setErrorConnection(true);
        }
    } catch (error) {
        console.error("Error: ", error);
        setErrorConnection(true);
    }
}

function ConnexionPcTemplate() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [errorConnection, setErrorConnection] = useState(false);

    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     console.log('Bouton cliqué !');
    // };

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();

    //     console.log('Form :', {
    //         email,
    //         password
    //     });
    // };

    const request = new Request("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })

    const handleSubmit = (event:any) =>  {
        event.preventDefault();

        connectionUser(request, setToken, setErrorConnection);

    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-2xl p-10 w-full max-w-xl shadow-[0_0_25px_rgba(0,0,0,0.15)]">
                <form onSubmit={handleSubmit} className="max-w-md w-full px-6 grid gap-10">
                    {/* HEADER CONNEXION */}
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <img className="w-20 object-contain" src={LogoJeb.src} alt="Logo GéoEmploi" />
                        <h1 className="flex justify-center font-bold text-xl">
                            GéoEmploi
                        </h1>
                    </div>
    
                    <div className="flex justify-center text-gray-500">
                        <p className="italic">Tous les champs sont obligatoires</p>
                    </div>

                    {errorConnection == true &&
                        <div className="flex justify-center text-red-500">
                            <p className="italic">Erreur lors de la connexion au compte.</p>
                        </div>
                    }

                    {/* INPUT CONNEXION */}
                    <div className="grid gap-6 mb-6">
                        <div className="grid gap-2">
                            <label className="text-lg font-bold">Email</label>
                            <Input placeHolder="prénom.nom@email.fr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-lg font-bold">Mot de passe</label>
                            <Input type="password" placeHolder="***********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </div>

                    <div className="flex gap-1 justify-center">
                        <p>Pas encore de compte ?</p>
                        <a href="/inscription/" role="Page création de compte" className="group text-sky-600 transition duration-300">
                            Créer un compte
                            <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-px bg-sky-600"></span>
                        </a>
                    </div>

                    <div className="flex justify-center">
                        <Button text="Se connecter" clickable={true} type="submit" role="se connecter"/>
                    </div>
                </form>
            </div>
        </div>
    )
}



export default ConnexionPcTemplate;