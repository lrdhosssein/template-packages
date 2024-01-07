/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import "./OTPInput.scss"

const OTPInput = (props) => {
    const [otp, setOtp] = useState(new Array(props.boxes).fill(""));

    const focusDiv = useRef();
    const focusDiv2 = useRef();

    const handleChange = (e, index) => {
        if (isNaN(e.target.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index) ? e.target.value : d)])

        if (e.target.value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
    }

    const handleKey = (e, index) => {
        if (isNaN(e.target.value)) return false;

        if (e.key === "Backspace" && e.target.value.length === 0 && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    }

    useEffect(() => {
        props.onChange(otp.join(""))
    }, [otp]);


    useEffect(() => {
        if (focusDiv.current) focusDiv.current.focus();
    }, [focusDiv]);

    return <div className="otp-input-container ltr" style={{ direction: "ltr" }}>
        {otp.map((data, index) => {
            return (
                <input
                    className={`otp-input-element
                    ${props.invalid
                            ? "invalid"
                            : ""
                        }`}
                    inputMode="numeric"
                    key={index}
                    ref={index === 0 ? focusDiv : focusDiv2}
                    maxLength={1}
                    value={data}
                    onChange={e => handleChange(e, index)}
                    onKeyDown={e => handleKey(e, index)}
                    style={{
                        ...props.style,
                    }}
                    {...props.elementConfig}
                />
            )
        })}
    </div>;
};

export default OTPInput;
