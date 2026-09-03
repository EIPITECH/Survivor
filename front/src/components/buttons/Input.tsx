type Props = {
    placeHolder : string,
    value?: string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    classInput: any
}

function Input({
    placeHolder,
    value,
    onChange,
    classInput
} : Props) {

    const classname = `bg-white border-2 border-black rounded-md px-2 py-2 outline-none transition-shadow duration-200 ease-out focus:border-[#1B3A6B] focus:ring focus:ring-[#1B3A6B] ${classInput}`

    return (
        <input
            className={classname}
            placeholder={placeHolder}
            value={value}
            onChange={onChange}
        />
    )
}

export default Input;