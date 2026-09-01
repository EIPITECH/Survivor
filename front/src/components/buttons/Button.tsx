type Props = {
    text : string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

function Button({
    text,
    onClick,
} : Props) {
    return (
        <button
            onClick={onClick}
            className='border-black border-2 rounded-2xl px-2'>
                {text}
        </button>
    )
}

export default Button;