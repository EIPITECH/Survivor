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
            {}
            <div>
                <div className="flex justify-center">
                    Postuler à une offre
                </div>
            </div>

            {}
            <div className="grid gap-6 mb-6">
                <div className="grid">
                    <label className="text-sm">Email</label>
                    <Input placeHolder="jean.dupont@epitech.eu"/>
                </div>
                <div className="grid">
                    <label className="text-sm">Nom</label>
                    <Input placeHolder="dupont"/>
                </div>
                <div className="grid">
                    <label className="text-sm">Prenom</label>
                    <Input placeHolder=""/>
                </div>
            </div>

            <div style={{ zIndex: "10000", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button text="Postuler" clickable={true} type="submit"/>
            </div>
        </form>
    )
}



export default PostulateTemplate;