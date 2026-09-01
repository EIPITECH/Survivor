type Props = {
    placeHolder : string,
    value?: string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

function Input({
    placeHolder,
    value,
    onChange,
} : Props) {
    return (
        <input
            className="bg-white border-black border-2 rounded-2xl px-2"
            placeholder={placeHolder}
            value={value}
            onChange={onChange}
            />
    )
}

export default Input;