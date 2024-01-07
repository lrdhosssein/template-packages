import OTPInput from "./elements/OTPInput/OTPInput";
import TitleTextArea from "./elements/TitleTextArea/TitleTextArea";
import "./Input.scss"
import Checkbox from "./elements/Checkbox/Checkbox";
import RadioButton from "./elements/RadioButton/RadioButton";
import { useTranslation } from "react-i18next";
import TitleInput from "./elements/TitleInput/TitleInput";
import DatePickerInput from "./elements/DatePickerInput/DatePickerInput";
import TimePickerInput from "./elements/TimePickerInput/TimePickerInput";
import SwitchInput from "./elements/SwitchInput/SwitchInput";
import DropDown from "./elements/DropDown/DropDown";
import MultiSelect from "./elements/MultiSelect/MultiSelect";
import SepratedSubMenu from "./elements/SepratedSubMenu/SepratedSubMenu";
import FileInput from "./elements/FileInput/FileInput";

const Input = (props) => {
    const {
        hint,
        invalid,
        shouldValidate,
        errorMessage,
        touched,
        errorStyle,
        hintStyle,
        containerStyle,
        inputStyle,
        elementType,
        elementConfig,
        value,
        onChange,
        onEnter,
        onExit,
        onKeyDown,
        children,
    } = props;
    const inputFontSize = 18;
    const { t } = useTranslation();

    let inputElement = null;
    let message = null;

    if (invalid && shouldValidate && touched) {
        message =
            <p
                className='message error-message'
                style={{
                    ...errorStyle
                }}
            >{value?.length > 0 ? errorMessage : t('key_field_is_empty')}</p>;
    } else {
        if (hint)
            message =
                <p
                    className='message hint'
                    style={{
                        ...hintStyle
                    }}
                >{hint}</p>;
    }

    switch (elementType) {
        case (elementTypes.input):
            inputElement = <input
                className={`input-element ${(invalid && shouldValidate && touched && !props.disabled) ? "invalid" : ""}`}
                {...elementConfig}
                value={value ? value : ''}
                style={{
                    width: props.size ? `${props.size * inputFontSize}px` : "100%",
                    ...inputStyle
                }}
                onChange={onChange}
                onFocus={onEnter}
                onKeyDown={onKeyDown}
                onBlur={onExit}
            />
            break;
        case (elementTypes.titleInput):
            inputElement = <TitleInput {...props} inputFontSize={inputFontSize} />
            break;
        case (elementTypes.datePicker):
            inputElement = <DatePickerInput {...props} inputFontSize={inputFontSize} />
            break;
        case (elementTypes.timePicker):
            inputElement = <TimePickerInput {...props} inputFontSize={inputFontSize} />
            break;
        case (elementTypes.switchInput):
            inputElement = <SwitchInput {...props} inputFontSize={inputFontSize} />
            break;
        case (elementTypes.titleTextarea):
            inputElement = <TitleTextArea {...props} inputFontSize={inputFontSize} />
            break;
        case (elementTypes.dropDown):
            inputElement = <DropDown {...props} inputFontSize={inputFontSize} />
            break;
        case (elementTypes.checkbox):
            inputElement = <Checkbox {...props} inputFontSize={inputFontSize} />
            break;
        case (elementTypes.radioButton):
            inputElement = <RadioButton {...props} inputFontSize={inputFontSize} />
            break;
        case (elementTypes.multiSelect):
            inputElement = <MultiSelect {...props} inputFontSize={inputFontSize} />
            break;
        case elementTypes.otp:
            inputElement = <OTPInput boxes={props.boxes} {...props} />
            break;
        case (elementTypes.fileInput):
            inputElement = <FileInput {...props} inputFontSize={inputFontSize} />
            break;
        case (elementTypes.sepratedSubMenu):
            inputElement = <SepratedSubMenu {...props} inputFontSize={inputFontSize} />
            break;

        default:
            inputElement = <input
                className={`input-element ${(invalid && shouldValidate && touched && !props.disabled) ? "invalid" : ""}`}
                {...elementConfig}
                value={value ? value : ''}
                style={{
                    width: props.size ? `${props.size * inputFontSize}px` : "100%",
                    ...inputStyle
                }}
                onChange={onChange}
                onFocus={onEnter}
                onBlur={onExit}
                onKeyDown={onKeyDown}

            />
            break;
    }

    return (
        <div
            className='input-container'
            style={{
                paddingBottom: errorMessage ? "1.5rem" : "0",
                flexDirection: elementType === elementTypes.checkbox ? "row" : "column",
                justifyContent: elementType === elementTypes.checkbox ? "flex-start" : "center",
                width: props?.size > 0 ? 'fit-content' : "100%",
                borderBottom: (props?.size === 0) && (elementType === elementTypes.titleInput) ? `2px solid ${"var(--secondary)"}` : "none",
                borderBottomRightRadius: (props?.size === 0) && (elementType === elementTypes.titleInput) ? 9 : 0,
                ...containerStyle,
            }}
        >
            {inputElement}
            {(errorMessage || hint) && message}
            {children}
        </div>
    );
};

export default Input;

export const elementTypes = {
    input: 'input',
    titleInput: 'titleInput',
    datePicker: 'datePicker',
    switchInput: 'switchInput',
    titleTextarea: 'titleTextarea',
    dropDown: 'dropDown',
    otp: 'otp',
    checkbox: 'checkbox',
    radioButton: 'radioButton',
    multiSelect: 'multiSelect',
    timePicker: 'timePicker',
    fileInput: 'fileInput',
    sepratedSubMenu: 'sepratedSubMenu'
}
