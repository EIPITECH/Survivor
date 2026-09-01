type Props = {
    label?: string,
    name: string,
    value?: string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

function Radio({
    label,
    name,
    value,
    onChange,
} : Props) {
    return (
        <div>
            <input
                type="radio"
                name={name}
                value={value}
                className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"/>
            <label className="select-none ms-2 text-sm font-medium text-heading">{label}</label>
        </div>
    )
}

export default Radio;
