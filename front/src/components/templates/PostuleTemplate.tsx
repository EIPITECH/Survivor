import { useState } from "react";
import Button from "../buttons/Button";
import Input from "../buttons/Input";
import Cookies from 'js-cookie';

function PostulateTemplate() {

    const handleSubmit = (event:any) =>  {
        event.preventDefault();

    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-4 gap-10">
            {/* HEADER CONNEXION */}
            <div>
                <div className="flex justify-center">
                    Postuler à une offre
                </div>
            </div>

            {/* INPUT CONNEXION */}
            <div className="grid gap-6 mb-6">
                <div className="grid">
                    <label className="text-sm">Email</label>
                    <Input placeHolder="alice.duvillier@epitech.eu"/>
                </div>
                <div className="grid">
                    <label className="text-sm">Nom</label>
                    <Input placeHolder="duvillier"/>
                </div>
                <div className="grid">
                    <label className="text-sm">Prenom</label>
                    <Input placeHolder="alice"/>
                </div>
            </div>

            <div>
                <Button text="Postuler" clickable={true} type="submit"/>
            </div>
        </form>
    )
}



export default PostulateTemplate;