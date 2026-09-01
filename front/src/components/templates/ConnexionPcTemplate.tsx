import Button from "../buttons/Button";
import Input from "../buttons/Input";

function ConnexionPcTemplate() {

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log('Bouton cliqué !');
    };

    return (
        <form className="grid grid-2 gap-10">
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
                    <Input placeHolder="Alice"/>
                </div>
                <div className="grid">
                    <label className="text-sm">Nom</label>
                    <Input placeHolder="Duvillier"/>
                </div>
                <div className="grid">
                    <label className="text-sm">Email</label>
                    <Input placeHolder="alice.duvillier@epitech.eu"/>
                </div>
                <div className="grid">
                    <label className="text-sm">Mot de passe</label>
                    <Input placeHolder="****"/>
                </div>
            </div>
        </form>
    )
}

export default ConnexionPcTemplate;