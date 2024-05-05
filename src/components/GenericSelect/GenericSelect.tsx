import React from "react";
import {iGenericSelectOptionProps} from "./GenericSelectOption";
import GenericSelectChild from "./GenericSelectChild";

export interface iGenericSelectProps {
    name?: string
    defaultSelected?: string
    isMulti?: boolean
    onChange?: (value: string | undefined) => void
    onChangeMulti?: (values: string[]) => void
}

interface iGenericSelectState {
    selected: string[]
}

export default class GenericSelect extends React.Component<iGenericSelectProps, iGenericSelectState> {
    constructor(props: iGenericSelectProps) {
        super(props);
        const selected = [];
        if (props.defaultSelected) selected.push(props.defaultSelected);
        this.state = {selected};
    }


    render() {
        return <>
            {this.renderInputFields()}
            {this.renderChildren()}
        </>;
    }

    renderInputFields = () => {
        const {name} = this.props;
        if (!name) return null;

        const values = this.state.selected;
        if (!values.length) return <input type="hidden" name={name} value=""/>;
        return values.map((value, index) => <input type="hidden" key={index} name={name} value={value}/>);
    };

    renderChildren = () => {
        return React.Children.map(this.props.children, (child) => {
            // @ts-ignore
            if (React.isValidElement(child) && child.type && child.type.displayName === "GenericSelectOption") {
                const childProps: iGenericSelectOptionProps = child.props;
                return <GenericSelectChild name={childProps.name}
                                           onSelect={this.onSelect}
                                           selected={this.state.selected.includes(childProps.name)}>
                    {childProps.children}
                </GenericSelectChild>
            } else {
                return child;
            }
        })
    };


    onSelect = (selected_id: string) => {
        const selected = this.props.isMulti ? [...this.state.selected] : [];
        const index = selected.indexOf(selected_id);

        if (index > -1) {
            selected.splice(index, 1)
        } else {
            selected.push(selected_id)
        }
        this.setState({selected}, this.onChange)
    };

    // onClear = () => {
    //     this.setState({selected: []}, this.onChange)
    // };

    onChange = () => {
        if (this.props.isMulti) {
            this.props.onChangeMulti && this.props.onChangeMulti(this.state.selected);
        } else {
            let value = undefined;
            const selected = this.state.selected;
            if (selected.length) value = selected[0];
            this.props.onChange && this.props.onChange(value);
        }
    }
}
