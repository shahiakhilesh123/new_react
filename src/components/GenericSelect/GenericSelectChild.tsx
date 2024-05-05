import React from "react";

export interface iGenericSelectChildProps {
    name: string
    onSelect?: (value: string) => void
    selected?: boolean
    children?: any
}

export default function GenericSelectChild(props: iGenericSelectChildProps) {
    const {name, onSelect, selected, children} = props;
    let className = "generic-select-child";
    if (selected) className += " active";
    return <div className={className}
                onClick={() => {
                    onSelect && onSelect(name)
                }}
    >
        {children}
    </div>;

}
