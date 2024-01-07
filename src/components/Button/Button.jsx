import { useEffect } from "react";
import "./Button.scss";
import tippy from 'tippy.js';
import { HiChevronDown } from "react-icons/hi";
import { HiMiniChevronDown } from "react-icons/hi2";

const Button = ({
    clicked,
    children,
    buttonType = buttonTypes.primary,
    disabled = false,
    loading = false,
    style = {},
    classes = [],
    title = null,
    buttonConfig = {},
    loadingColor = null,
    onArrowClick = null,
    animations = true
}) => {
    const classNames =
        `button-component ${buttonType === buttonTypes.primary ? "bg-primary text-white" : ""}
        ${loading ? "button-loading" : ""} ${classes?.join(' ')}
        ${onArrowClick ? 'pe-[30px]' : ''}`

    const onClickHandler = (e) => {
        animations && createRipple(e);
        clicked && clicked(e);
    }

    const onArrowClickHandler = (e) => {
        e.stopPropagation();
        onArrowClick && onArrowClick();
    };

    const createRipple = (event) => {
        const button = event.currentTarget;

        const circle = document.createElement("span");
        circle.classList.add("button-span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = (diameter / 2);

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button?.getBoundingClientRect()?.left - radius}px`;
        circle.style.top = `${event.clientY - button?.getBoundingClientRect()?.top - radius}px`;
        circle.style.backgroundColor = "var(--hover)";
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];

        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    useEffect(() => {
        if (!title) return;
        const instances = tippy('button', {
            animation: "scale",
            touch: ['hold', 500],
            duration: [150, 0],
            delay: [300, 0],
            theme: localStorage.getItem('darkMode') === "enabled" ? 'light-border' : "sijam"
        });
        instances.forEach(instance => {
            if (!instance.props.content) instance.disable();
        });
    }, [title]);

    return (
        <button
            className={classNames}
            disabled={disabled}
            style={{
                "--loading-color": loadingColor || (buttonType === buttonTypes.primary ? "white" : "var(--primary)"),
                ...style,
                "&:active": {
                    transform: animations ? "scale(0.97)" : "scale(1)"
                }
            }}
            onClick={onClickHandler}
            data-tippy-content={title}
            {...buttonConfig}
        >
            <div className={`button-children flex justify-center items-center gap-1`}>
                {children}
            </div>
            <div
                className={`${onArrowClick ? 'flex-center arrow-in-button-wrapper' : 'hidden'}`}
                onClick={onArrowClickHandler}
            >
                {buttonType ? <HiMiniChevronDown /> : <HiChevronDown />}
            </div>
        </button>
    );
};

export const buttonTypes = {
    primary: "button-primary",
    secondary: "button-secondary",
    third: "button-third",
}

export default Button;
