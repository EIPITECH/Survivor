import Button from "../buttons/Button";

function HeaderPc() {
    return (
        <header className="flex justify-between border-2 px-10 py-2 bg-[#1B3A6B]">
            <div>
                <div>logo</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Button text="position refusée"/>
                <Button text="mes candidatures" clickable={true}/>
                <Button text="connexion" clickable={true} link="/connexion/"/>
            </div>
        </header>
    )
}

export default HeaderPc;
