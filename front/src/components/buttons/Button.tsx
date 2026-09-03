type Props = {
    text: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    clickable?: boolean,
    link?: string,
    type?: any,
}

function Button({
    text,
    onClick,
    clickable,
    link,
    type
}: Props) {
    const className = `bg-gray-200 text-[#1B3A6B] rounded-xl px-6 py-4 flex justify-center items-center h-fit text-xl transition-colors duration-200 ease-in-out
            ${clickable ? 'hover:cursor-pointer hover:bg-gray-400 hover:text-white' : ''}`;

    if (link) {
    return (
        <a href={link} className={className}>
            {text}
        </a>
    )
    }

    return (
    <button onClick={onClick} className={className} type={type}>
        {text}
    </button>
    )
}

export default Button;