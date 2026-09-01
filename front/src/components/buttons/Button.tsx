type Props = {
    text: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    clickable?: boolean,
    link?: string,
}

function Button({ text, onClick, clickable, link }: Props) {
    const className = `border-black border-2 rounded-2xl px-2 flex justify-center ${clickable ? 'hover:cursor-pointer' : ''}`;

    if (link) {
    return (
        <a href={link} className={className}>
            {text}
        </a>
    )
    }

    return (
    <button onClick={onClick} className={className}>
        {text}
    </button>
    )
}

export default Button;