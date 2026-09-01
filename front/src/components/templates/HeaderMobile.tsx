import Button from "../buttons/Button";
import SwitchLocation from "../toggleSwitchLoc";

function HeaderMobile() {
    return (
        <header className="flex justify-between border-2 px-10 py-2 bg-[#1B3A6B]">
            <div>
                <div>logo</div>
            </div>
            <div className="flex gap-4">
                <SwitchLocation />
                {/* <Button text="mes candidatures" clickable={true}/> */}
                <Button text="connexion" clickable={true} link="/connexion/"/>
            </div>
        </header>
    )
}

export default HeaderMobile;