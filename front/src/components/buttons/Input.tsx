type Props = {
    placeHolder : string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

function Input({
    placeHolder,
    onClick,
} : Props) {
    return (
        <input
            className="border-black border-2 rounded-2xl px-2"
            placeholder={placeHolder}/>
    )
}

export default Input;