/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./RadioButton.scss"
const RadioButton = (props) => {
    const {
        label,
        checked,
        onChange,
        disabled,
        style,
        name
    } = props;
    const [isChecked, setIsChecked] = useState(false)
    const inputLabel = label || props.title;

    const onInputFocus = () => {
        props.onEnter && props.onEnter()
    }

    const onInputBlur = () => {
        props.onExit && props.onExit()
    }

    useEffect(() => {
        if (props.permanentOpen) {
            if (!props.value) return;
        } else setIsChecked(checked)
    }, [checked, props.value])

    return (
        <label className="container">{inputLabel}
            <input
                type="radio"
                disabled={disabled}
                checked={isChecked}
                onChange={onChange}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                name={name}
            />
            <span className="checkmark" style={{ ...style }}></span>
        </label>
    );
};

export default RadioButton;
