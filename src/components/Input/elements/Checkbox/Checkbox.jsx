/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import "./Checkbox.scss"
import { useEffect } from "react";

const Checkbox = (props) => {
    const {
        item = null, // {id,text}
        checked = false,
        onChange,
        disabled,
        style
    } = props;
    const [isChecked, setIsChecked] = useState(false)
    const inputId = item ? item?.id || item?._id : props._id;
    const label = item ? item?.text : props.title;

    const onInputFocus = () => {
        props.onEnter && props.onEnter()
    }

    const onInputBlur = () => {
        props.onExit && props.onExit()
    }


    useEffect(() => {
        if (props.permanentOpen) {
            if (!props.value) return;
            setIsChecked(props.value === 'بلی')
        } else setIsChecked(checked)
    }, [checked, props.value])



    return (
        <>
            <input
                id={inputId}
                type="checkbox"
                value=""
                checked={isChecked}
                onChange={onChange}
                disabled={disabled || props.elementConfig?.readOnly}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                style={{ ...style }}
            />
            {label &&
                <label
                    className={`checkbox-label ${disabled && 'label-disabled'}`}
                    htmlFor={inputId}
                    style={{
                        ...props.titleStyle,
                        fontWeight: (!props.permanentOpen || props?.size > 0) ? "300" : "600"
                    }}
                >
                    {label}
                </label>
            }
        </>
    );
};

export default Checkbox;
