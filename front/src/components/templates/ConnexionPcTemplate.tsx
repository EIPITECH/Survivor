import { useState } from "react";
import Button from "../buttons/Button";
import Input from "../buttons/Input";
import Cookies from 'js-cookie';

async function connectionUser(request:Request, setToken:any) {
    try {
        const response = await fetch(request);
        const result = await response.json();
        console.log("Success: ", result);
        setToken(response.json())
        Cookies.set('token', typeof result === 'string' ? result : JSON.stringify(result), { expires: 7, secure: true })
    } catch (error) {
        console.error("Error: ", error);
    }
}

function ConnexionPcTemplate() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

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

        connectionUser(request, setToken);

    }

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