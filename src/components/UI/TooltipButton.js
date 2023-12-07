import React from "react";
import Tooltip from "../Tooltip";

export default function TooltipButton({
    children = null,
    title,
    ...rest
}) {
    return (
        <>
            <Tooltip content={title} {...rest}>
                <span>{children}</span>
            </Tooltip>
        </>
    );
}
