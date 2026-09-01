import Button from "../buttons/Button";
import Input from "../buttons/Input";

function ConnexionPcTemplate() {

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log('Bouton cliqué !');
    };

    return (
        <form>
            <Button text="button" onClick={handleClick}/>
            <Input placeHolder="placeHolder"/>
            <div className="grid gap-6 mb-6">
                <div>
                    <label className="text-sm">Prénom</label>
                    <input className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                            placeholder="Alice"/>
                </div>
                <div>
                    <label className="text-sm">Nom</label>
                    <input className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                            placeholder="Duvillier"/>
                </div>
                <div>
                    <label className="text-sm">Email</label>
                    <input className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                            placeholder="alice.duvillier@epitech.eu"/>
                </div>
                <div>
                    <label className="text-sm">Mot de passe</label>
                    <input className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                            placeholder="****"/>
                </div>
            </div>
        </form>
    )
}

export default ConnexionPcTemplate;