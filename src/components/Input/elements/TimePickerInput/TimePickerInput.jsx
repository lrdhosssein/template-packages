/* eslint-disable react-hooks/exhaustive-deps */
import './TimePickerInput.scss';
import { getTextWidth } from '../../../../utils/pureFunctions';
import TimePicker from 'antd/es/time-picker';
import dayjs from 'dayjs';
import { useEffect, useState, useRef } from 'react';

const TimePickerInput = (props) => {
    const [drop, setDrop] = useState(false);
    const [format, setFormat] = useState('HH:mm');
    const [size, setSize] = useState(6);
    const [placeHolder, setPlaceHolder] = useState("-- : --");

    const timePickerRef = useRef();

    const onChange = (time, timeString) => {
        props.onChange({ target: { value: timeString } });
        setDrop(false);
    };

    useEffect(() => {
        if (!props.value) return;
        if (props.value.length > 5) {
            setFormat('HH:mm:ss')
            setPlaceHolder("-- : -- : --")
            setSize(8)
        }
        else {
            setFormat('HH:mm')
            setPlaceHolder("-- : --")
            setSize(6)
        }
    }, [props.value]);

    useEffect(() => {
        if (!props?.format) return;
        setFormat(props.format)
        let count = props.format.split(":").length,
            temp = [...new Array(count)].map((_) => ("--")).join(" : "),
            length = (count * 2) + 2;
        setPlaceHolder(temp)
        setSize(length)
    }, [props.format]);

    return (
        <div
            className='title-time-picker-container'
            style={{
                width: props.size ? 'fit-content' : "100%",
                ...props.inputContainer
            }}
            onKeyDown={(e) => {
                if (e.key === "Tab") {
                    setDrop(false);
                    timePickerRef.current?.blur();
                }
            }}
        >
            <p
                className='title-class-name'
                style={{
                    ...props.titleStyle
                }}
            >
                {props.HPTitle || props.title}
                {(props.validation) && (props.validation.required &&
                    <span className="required">
                        *
                    </span>
                )}
            </p>
            <TimePicker
                {...props.elementConfig}
                ref={timePickerRef}
                className={`time-picker-container 
                            ${(props.invalid && props.shouldValidate && props.touched && !props.disabled) ? "invalid" : ""} 
                            ${props.elementConfig?.readOnly ? "input-read-only" : ""}`}
                value={(props.value && dayjs(props.value, format, true).isValid()) ? dayjs(props.value, format) : null}
                onChange={onChange}
                inputReadOnly={true}
                placeholder={placeHolder}
                size="small"
                format={format}
                suffixIcon={null}
                clearIcon={null}
                onFocus={() => setDrop(true)}
                onClick={() => setDrop(true)}
                onBlur={() => setDrop(false)}
                open={props.elementConfig?.readOnly ? false : drop}
                style={{
                    width: props.size ? getTextWidth([...new Array(parseInt(size))].map(item => '۴').join('')) : "100%",
                    ...props.inputStyle,
                }}
            />
        </div>

    )
}

export default TimePickerInput
