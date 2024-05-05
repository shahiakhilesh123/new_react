import React from "react";
import "./style.css";
import cn from "classnames";


interface MenuActionProps {
    className?: string,
    onClick?: any,
    style?: any,
    children?: any
}

function OnboardButton(props: MenuActionProps) {

    const handleClick = () => {
      (window as any).Produktly.startChecklist({
        checklistId: 518,
      });
    }


    let classes = cn(
        "onboard-button",
        props.className
    );
    return <button onClick={handleClick} className={classes}>{props.children}</button>;

}

export default OnboardButton;