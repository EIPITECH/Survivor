type Props = {
    placeHolder : string,
    value?: string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    classInput?: any,
    type?: string
}

function Input({
    placeHolder,
    value,
    onChange,
    classInput,
    type = "text"
} : Props) {

    const classname = `bg-white border-2 border-black rounded-md px-2 py-2 outline-none transition-shadow duration-200 ease-out focus:border-[#1B3A6B] focus:ring focus:ring-[#1B3A6B] ${classInput}`

    return (
        <input
            type={type}
            className={classname}
            placeholder={placeHolder}
            value={value}
            onChange={onChange}
        />
    )
}

export default Input;