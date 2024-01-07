/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import "./DropDown.scss";
import Select, { components } from 'react-select';
import Loading from "../../../loading/loading";
import { getTextWidth } from "../../../../utils/pureFunctions";
import { IoIosShareAlt } from "react-icons/io";
import { useTranslation } from "react-i18next";
import toLangDigits from "../../../../utils/toLangDigits";

const DropDown = (props) => {
    const [searchValue, setSearchValue] = useState('')
    const [filterItems, setFilterItems] = useState([])
    const [pageIndex, setPageIndex] = useState(1);
    const [drop, setDrop] = useState(false);
    const [lock, setLock] = useState(true)

    const { t } = useTranslation();

    const onBlur = () => {
        setDrop(false)
    }
    const parentRef = useRef()
    const onFocus = () => {
        props.onEnter && props.onEnter(searchValue)
        setDrop(true)
        setLock(false)

    }

    const handleKeyDown = (e) => {
        if (props.permanentOpen) {
            switch (e.keyCode) {
                case 8: //BackSpace
                case 46: //Del
                    props.onChange({ id: "", value: "", label: "", text: "" });
                    break;

                default:
                    break;
            }
        }
        else {
            if (props.onKeyDown) props.onKeyDown(e)
        }
    }

    useEffect(() => {
        if (props.backSearch)
            return
        if (!props.items || props.items.length === 0) {
            setFilterItems([])
            return;
        }
        let updatedItems = [];
        if (searchValue)
            updatedItems = props.items.filter(item => item.text.includes(searchValue))
        else
            updatedItems = props.items
        setFilterItems(updatedItems.map(item => {
            return {
                ...item,
                value: item.value || item.text,
                label: item.label || item.text,
            }
        }))
    }, [searchValue, props.items])

    useEffect(() => {
        if (!props.backSearch)
            return
        if (!props.items || props.items.length === 0) {
            setFilterItems([])
            return;
        }
        let updatedItems = [...props.items];
        setFilterItems(updatedItems.map(item => {
            return {
                ...item,
                value: item.value || item.text,
                label: item.label || item.text,
            }
        }))
    }, [props.items,])

    useEffect(() => {
        if (!props.backSearch || lock) return;
        if (searchValue)
            setPageIndex(1)
        props.fetchItems(searchValue, true)

    }, [searchValue])

    useEffect(() => {
        if (pageIndex < 2 || !props.hasMore) return
        props.fetchItems(searchValue)
    }, [pageIndex]);

    // console.log(props.toggleFocus)
    useEffect(() => {
        if (!(props.toggleFocus)) return;
        parentRef?.current?.focus()
    }, [props.toggleFocus])
    useEffect(() => {
        if (!(props.toggleFocusId) || !props._id) return;
        if (props.toggleFocusId === props._id) {
            parentRef?.current?.focus()
            props.setToggleFocusId('')
        }
    }, [props.toggleFocusId])


    return (
        <div
            className='dropdown-container'
            style={{
                width: props.size ? 'fit-content' : "100%",
                ...props.inputContainer
            }}
        >
            <p className='title-class-name'
                style={{
                    display: props.title ? "flex" : "none",
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
            <Select
                ref={parentRef}
                id={props.elementConfig?.id}
                isDisabled={props.elementConfig?.disabled}
                styles={{
                    container: (base) => ({
                        ...base,
                        maxWidth: "100%",
                        width: props.size ? "fit-content" : "100%",
                        ...props.inputContainer
                    }),
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        width: "100%",
                        cursor: "pointer",
                        boxShadow: "none",
                        flexWrap: "nowrap",
                        fontSize: "14px",
                        lineHeight: "18px",
                        ...props.inputStyle,
                        borderColor: state.isFocused ? "var(--primary)" : props.inputStyle?.borderColor || "var(--border)"
                    }),
                    option: (base, state) => ({
                        ...base,
                        display: "flex",
                        fontSize: "13px",
                        lineHeight: "20px",
                        padding: 0,
                        cursor: state.isSelected ? "default" : "pointer",
                    }),
                    menuList: (base) => ({
                        ...base,
                        margin: "0.5em",
                        ...props.menuStyle
                    }),
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 2602,
                    }),
                    menu: (base) => ({
                        ...base,
                        minWidth: "fit-content",
                        backgroundColor: "var(--surface)",
                        color: "var(--on-surface)",
                        boxShadow: "0 0 0 1px var(--border), 0 4px 11px hsla(0, 0%, 0%, 0.2)",
                        overflow: "hidden"
                    }),
                    dropdownIndicator: (base, state) => ({
                        ...base,
                        display: props.loading ? "none" : "flex",
                        padding: "0px",
                        transition: "transform 100ms ease",
                        transform: drop ? "rotate(180deg)" : "rotate(0)",
                    }),
                    loadingMessage: (base) => ({ ...base, padding: "0.2em 1em", fontSize: "14px", ...props.inputStyle }),
                    noOptionsMessage: (base) => ({ ...base, padding: "0.2em 1em", fontSize: "14px", ...props.inputStyle }),
                    input: (base) => ({
                        ...base,
                        padding: "0",
                        margin: "0",
                        color: "var(--on-surface)"
                    }),
                    valueContainer: (base) => ({
                        ...base,
                        padding: "0.2em calc(0.4em - 2px)",
                        margin: "0",
                        width: props.size ? getTextWidth([...new Array(parseInt(props.size))].map(item => 'ک').join('')) : "100%",
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: "var(--on-surface)"
                    }),
                    placeholder: (base) => ({
                        ...base,
                        opacity: 0.5
                    }),
                }}
                classNames={{
                    control: () => `dropdown-input ${(props.invalid && props.shouldValidate && props.touched) ? "invalid" : ""}`,
                    option: () => 'list-option'
                }}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: 'var(--primary)',
                        primary75: 'var(--primary)',
                        primary50: 'var(--secondary)',
                        primary25: 'var(--secondary)',
                    },
                })}
                menuPosition="fixed"
                components={{ LoadingIndicator: Loading, Option, IndicatorSeparator: null }}
                placeholder={(props.size && props.permanentOpen) ? props.size < 10 ? '-' : t(props.placeholder || t('select')) : t(props.placeholder || t('select'))}
                onChange={props.onChange}
                // value={props.value ? { value: props.value, label: props.value } : ''}
                value={props.value === 0 ? { value: "0", label: "0" } : props.value ? { value: props.value, label: props.value } : ''}
                noOptionsMessage={() => (props.noOptionsMessage || t('not_found'))}
                loadingMessage={() => t('loading')}
                isLoading={props.loading}
                options={filterItems}
                onInputChange={(e) => setSearchValue(e)}
                onFocus={onFocus}
                onBlur={onBlur}
                onMenuScrollToBottom={() => setPageIndex(prev => prev + 1)}
                menuPortalTarget={document.body}
                minMenuHeight={300}
                required={props.validation && props.validation.required}
                isRtl={true}
                isSearchable={props.searchable}
                menuPlacement="auto"
                blurInputOnSelect={false}
                onKeyDown={handleKeyDown}
                tabSelectsValue={false}
                menuIsOpen={drop}
                onMenuOpen={() => setDrop(true)}
                onMenuClose={() => setDrop(false)}
                listItemStyle={props.listItemStyle}
            />
        </div>
    )
}

export default DropDown

const Option = (props) => {
    const { t } = useTranslation();
    return (
        <components.Option {...props} >
            <p
                title={props.data?.editor && `${t('edit')} : ${props.data?.editor}`}
                style={props.selectProps.listItemStyle}
            >
                {toLangDigits(props.data.label)}
            </p>
            {props.data.secondText &&
                <p className="option-second-text" style={props.selectProps.listItemStyle}>
                    {props.data.secondText === 'shared'
                        ? <IoIosShareAlt title={props.data?.by} />
                        : toLangDigits(props.data.secondText)
                    }
                </p>
            }
        </components.Option>
    );
};