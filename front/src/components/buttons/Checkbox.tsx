type Props = {
    label?: string,
    value?: string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

function Checkbox({
    label,
    value,
    onChange,
} : Props) {
    return (
        <div>
            <input
                type="checkbox"
                value={value}
                className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"/>
            <label className="select-none ms-2 text-sm font-medium text-heading">{label}</label>
        </div>
    )
}

export default Checkbox;
