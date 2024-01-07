/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import './TitleTextArea.scss'
import { useTranslation } from "react-i18next";
import { getTextWidth } from '../../../../utils/pureFunctions';

const TitleTextArea = (props) => {
    const [value, setValue] = useState('');


    const { t } = useTranslation();

    const onInputFocus = () => {
        props.onEnter && props.onEnter()
    }

    const onInputBlur = () => {
        props.onExit && props.onExit()
    }

    const onChange = (newValue) => {
        setValue(newValue)
        props.onChange({ target: { value: newValue } })
    }

    useEffect(() => {
        if (`${props.value}` === `${value}`) return;
        setValue(props.value);
    }, [props.value]);

    return (
        <div
            className='title-textarea-container'
            style={{
                width: props.size ? 'fit-content' : "100%",
                ...props.inputContainer
            }}
        >
            <p
                className='title-class-name'
                style={{
                    // width: props.size ? `${props.size * props.inputFontSize}px` : "100%",
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
            <textarea
                className={`input-element ${(props.invalid && props.shouldValidate && props.touched) ? "invalid" : ""}
                border border-solid bg-white focus:border-amber-500 border-gray-200`}
                {...props.elementConfig}
                placeholder={t(props.placeholder)}
                maxLength={props?.size ? props.elementConfig?.maxLength : "undefined"}
                value={value}
                style={{
                    resize: "vertical",
                    height: props?.height > 0 ? `${props.height}px` : 100,
                    minHeight: 30,
                    width: props.size ? getTextWidth([...new Array(parseInt(props.size))].map(item => 'ک').join('')) : "100%",
                    ...props.inputStyle
                }}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default TitleTextArea
