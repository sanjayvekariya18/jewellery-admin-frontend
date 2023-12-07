import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

const Tooltip = ({
    children,
    content = "content",
    title,
    className = "btn btn-dark",
    placement = "top",
    arrow = true,
    theme = "theme",
    animation = "shift-away",
    trigger = "mouseenter focus",
    interactive = true,
    allowHTML = false,
    maxWidth = 300,
    duration = 200,
}) => {
    console.log('theme', theme);
    return (
        <div className="custom-tippy">
            <Tippy
                content={content}
                placement={placement}
                arrow={arrow}
                theme={theme}
                animation={animation}
                trigger={trigger}
                interactive={interactive}
                allowHTML={allowHTML}
                maxWidth={maxWidth}
                duration={duration}
            >
                {children ? children : <button className={className}>{title}</button>}
            </Tippy>
        </div>
    );
};

export default Tooltip;
