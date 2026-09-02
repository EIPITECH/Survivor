import { useState } from "react";
import Button from "../buttons/Button";
import Input from "../buttons/Input";

function ConnexionPcTemplate() {


    return (
        <form className="grid grid-4 gap-10">
            {/* HEADER JOB OFFER CREATION*/}
            <div>
                <div className="flex justify-center">
                    Création d'une offre d'emploi
                </div>
            </div>

            {/* INPUT CONNEXION */}
            <div className="grid gap-6 mb-6">
                <div className="grid">
                    <label className="text-sm">Titre de l'offre</label>
                    <Input placeHolder="Ex: Développeur Full Stack" />
                </div>
                <div className="grid">
                    <label className="text-sm">Description de l'offre</label>
                    <Input placeHolder="Décrivez l'offre..." />
                </div>
            </div>

            <div>
                <Button text="submit" clickable={true} type="submit"/>
            </div>
        </form>
    )
}



export default ConnexionPcTemplate;