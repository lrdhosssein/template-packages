/* eslint-disable react-hooks/exhaustive-deps */
import './DatePickerInput.scss'
import DatePicker, { } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import gregorian from "react-date-object/calendars/gregorian"
import gregorian_en from "react-date-object/locales/gregorian_en"
import { useRef } from 'react'
import { getTextWidth } from '../../../../utils/pureFunctions'
import { HiCalendar } from "react-icons/hi2";
import InputMask from 'react-input-mask';

const DatePickerInput = (props) => {
    const pickerRef = useRef();

    const focusInput = () => {
        let input = document.getElementById(props.elementConfig?.id);
        input?.focus();
    }

    return (
        <div
            className='title-date-picker-container'
            style={{
                width: props.size ? 'fit-content' : "100%",
                ...props.inputContainer
            }}
            onKeyDown={(e) => {
                if (e.key === "Tab")
                    pickerRef.current.closeCalendar();
            }}
        >
            <div
                className='title-class-name'
                style={{
                    margin: props.title ? "0 0.2em 0.2em" : "0",
                    // width: props.size ? `${props.size * props.inputFontSize}px` : "100%",
                    ...props.titleStyle,
                    fontWeight: (!props.permanentOpen || props?.size > 0) ? "300" : "600"
                }}
            >
                {props.HPTitle || props.title}
                {(props.validation) && (props.validation.required &&
                    <span className="required">
                        *
                    </span>
                )}
            </div>
            <DatePicker
                ref={pickerRef}
                calendar={props.config?.dateType === 'geo' ? gregorian : persian}
                locale={props.config?.dateType === 'geo' ? gregorian_en : persian_fa}
                value={props.value}
                onChange={(date) => {
                    if (date)
                        props.onChange(date);
                    else
                        props.onChange('');
                }}
                minDate={props.elementConfig?.minDate ? props.elementConfig.minDate : ''}
                maxDate={props.elementConfig?.maxDate}
                render={<DateInput props={props} />}
                portal
                calendarPosition='top'
                onOpenPickNewDate={false}
                hideOnScroll={true}
                zIndex={2610}
                onOpen={focusInput}
            />
        </div>
    )
}

export default DatePickerInput

function DateInput({ value, onChange, openCalendar, props }) {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
        arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];

    const fixNumbers = (str) => {
        if (typeof str === "string") {
            for (var i = 0; i < 10; i++) {
                // str = str.replace(/[^0-9/٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹]/g, "");
                str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
            }
        }
        return str;
    };

    const valueFinal = value ? fixNumbers(value.toString()) : '';

    const handleFocus = (e) => {
        props.onEnter && props.onEnter();
        e.target.select();
    }

    return (
        <div className='date-picker-input'>
            <InputMask
                type="text"
                className={`date-picker-container ${(props.invalid && props.shouldValidate && props.touched) ? "invalid" : ""}`}
                style={{
                    width: props.size ? getTextWidth([...new Array(parseInt(12))].map(item => '۴').join('')) : "100%",
                    ...props.inputStyle,
                }}
                id={props.elementConfig?.id}
                disabled={props.elementConfig?.disabled}
                readOnly={props.elementConfig?.readOnly}
                locale={props.config?.dateType === 'geo' ? gregorian_en : persian_fa}
                placeholder={props.placeholder || '----/--/--'}
                mask="9999/99/99"
                maskChar={"-"}
                autoComplete='off'
                value={valueFinal}
                onChange={onChange}
                onFocus={handleFocus}
            />
            <div className="calendar-icon active:scale-95">
                <HiCalendar onClick={openCalendar} />
            </div>
        </div>
    );
}