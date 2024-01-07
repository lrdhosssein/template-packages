/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, memo } from 'react';
import useOnClickOutside from '../../../../hooks/useOnClickOutside';
import './TitleInput.scss'
import Loading from '../../../loading/loading';
import { components } from 'react-select';
import Creatable from 'react-select/creatable';
import { addCommas, getTextWidth, removeNonNumeric } from '../../../../utils/pureFunctions';
import { useTranslation } from "react-i18next";
import tippy from 'tippy.js';
import toLangDigits from '../../../../utils/toLangDigits';

const TitleInput = memo((props) => {
    const [drop, setDrop] = useState(false)
    const [filterItems, setFilterItems] = useState(null);
    const [searchValue, setSearchValue] = useState('')
    const [pageIndex, setPageIndex] = useState(1);
    const [lock, setLock] = useState(true);
    const [addMode, setAddMode] = useState(false);
    const [focus, setFocus] = useState(false);
    const [value, setValue] = useState('')
    const [clicked, setClicked] = useState(false)

    const parentRef = useRef(null)
    let noPopup = props.hasOwnProperty("noPopup") ? props.noPopup : true;
    const { t } = useTranslation();

    const divRef = useRef();
    const inRef = useRef();

    useOnClickOutside(inRef, divRef, () => {
        setDrop(false);
    });

    const onInputBlur = () => {
        setFocus(false);
        // props.onExit && props.onExit()
        if (drop) setDrop(false)
    }

    const onInputFocus = () => {
        setFocus(true);
        if (noPopup) setDrop(false)
        else {
            setAddMode(false)
            setLock(false)
            if (props.hasMore || props.items?.length > 0) {
                setDrop(true)
            }
        }
        props.onEnter && props.onEnter(searchValue)
    }
    const onInputKeyDown = (e) => {
        if (props.permanentOpen || props.checkKeyDown) {
            if (addMode)
                setAddMode(false);
            if (e.keyCode === 9) //Tab
                onInputBlur()
            if (props.type === "عدد" && (e.key === '+' || e.key === '-')) {
                let max = props.elementConfig?.maxLength || 100000000;
                let extraLen = e.keyCode === 107 ? 3 : e.keyCode === 109 ? 2 : 1;
                if (`${props.value}`.length + extraLen < max + 1) {
                    let extra = e.keyCode === 107 ? '000' : e.keyCode === 109 ? '00' : e.key
                    itemClickHandler(props.value + extra);
                }
            }
            if (noPopup) return;
            switch (e.keyCode) {
                case 112: //F1
                    e.preventDefault?.();
                    setDrop(!drop)
                    break;
                case 115: //F4
                    e.preventDefault?.();
                    setSearchValue('');
                    setAddMode(!addMode)
                    break;
                case 27: //Escape
                    setDrop(false)
                    break;
                case 32:
                    if (!props.balance || drop) return;
                    if (props.balance > 0 && `${props.fieldKey}` !== `${props.footerDetail?.debtorCode}`) return;
                    if (props.balance < 0 && `${props.fieldKey}` !== `${props.footerDetail?.creditorCode}`) return;
                    e.preventDefault();
                    itemClickHandler(Math.abs(props.balance))
                    break;

                default:
                    break;
            }
        }
        else {
            if (props.onKeyDown) props.onKeyDown(e)
        }
    }

    const itemClickHandler = (item, clicked = false) => {
        let value = item instanceof Object ? item.text : item;
        if (props?.type === "عدد")
            value = removeNonNumeric(value);
        props.onChange({ target: { value: value || '' } })
        if (!addMode) setDrop(false)
        if (clicked) {
            setSearchValue('')
            setClicked(true)
        }
    }

    useEffect(() => {
        if (!props.inputEnteredKey?.split('_')[1] || !props._id || props.inputEnteredKey?.split('_')[1] !== props._id) return;
        return (() => {
            setSearchValue('')
        })
    }, [props.inputEnteredKey?.split('_')[1], props._id]);

    useEffect(() => {
        if (!(props.toggleFocusId) || !props._id) return;
        if (props.toggleFocusId === props._id) {
            parentRef?.current?.focus()
            props.setToggleFocusId('')
        }
    }, [props.toggleFocusId])

    useEffect(() => {
        if (props.backSearch)
            return;
        if (!props.items || props.items.length === 0) {
            setFilterItems([])
            return;
        }
        let updatedItems = [];
        if (props.permanentOpen)
            setDrop(true)
        if (searchValue) {
            updatedItems = props.items.filter(item => `${item.text}`.includes(searchValue))
        }
        else {
            updatedItems = props.items
        }
        if (!drop && updatedItems?.length > 0 && props.inputEnteredKey?.split('_')[1] === props._id
            && (props.config?.mainGroups || focus)) {
            setDrop(true)
        }
        setFilterItems(updatedItems.map(item => {
            return {
                ...item,
                value: item.value || item.text,
                label: item.label || item.text,
            }
        }))
    }, [searchValue, props.items])

    useEffect(() => {
        if (!props.backSearch) return
        if (!props.items || props.items.length === 0) {
            setFilterItems([])
            return;
        }
        let updatedItems = [...props.items];
        if (!drop && updatedItems?.length > 0 && props.inputEnteredKey?.split('_')[1] === props._id
            && (props.config?.mainGroups || focus)) {
            if (clicked)
                setClicked(false)
            else
                setDrop(true)
        }
        setFilterItems(updatedItems.map(item => {
            return {
                ...item,
                value: item.value || item.text,
                label: item.label || item.text,
            }
        }))
    }, [props.items])


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

    useEffect(() => {
        if (!props.value && props.inputEnteredKey?.split('_')[1] === props._id) setSearchValue('')
        if (props.backSearch && !props.value && props.items?.length > 0 && filterItems?.length > 0 && !drop && props.inputEnteredKey?.split('_')[1] === props._id)
            setDrop(true)
        if (props.value !== value)
            setValue(props.value)
    }, [props.value])

    useEffect(() => {
        if (!props.customHint) return;
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
    }, [props.customHint]);

    return (
        <div className='title-input-container'
            style={{ width: props.size ? 'fit-content' : "100%", ...props.inputContainer }}
            ref={props.customRef}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
        >
            <div
                className={`title-class-name ${(props.permanentOpen && props?.size === 0) ? 'category-title' : ''}`}
                style={{
                    // width: props.size ? `${props.size * props.inputFontSize}px` : "100%",
                    margin: !props.title || (props.permanentOpen && props?.size === 0) ? 0 : "0 0.2em 0.2em",
                    ...props.titleStyle,
                }}
            >
                {props.HPTitle || props.title}
                {(props.validation) && (props.validation.required &&
                    <span className="required">
                        *
                    </span>
                )}
                {
                    props.checkNeeded &&
                    <span>loading...</span>
                }
                {
                    props.status === 1 && <span>valid</span>
                }
                {
                    props.status === 2 && <span>invalid</span>
                }
                {
                    (props.permanentOpen && props?.size === 0 && props.value) && <span className='category-error-message'>{props.value}</span>
                }
            </div>
            {noPopup ? <input
                className={`input-element ${(props.invalid && props.shouldValidate && props.touched && !props.elementConfig?.disabled) ? "invalid" : ""}`}
                {...props.elementConfig}
                placeholder={t(props.placeholder)}
                value={value === 0 ? 0 : value ? value : ''}
                style={{
                    width: props.size ? getTextWidth([...new Array(parseInt(props.size))].map(item => 'ک').join('')) : "100%",
                    padding: "0.2em calc(0.4em - 2px)",
                    display: (props.permanentOpen && props?.size === 0) ? "none" : "block",
                    ...props.inputStyle,
                }}
                onChange={(e) => {
                    if (props.type === "عدد" && (e.nativeEvent.data === '+' || e.nativeEvent.data === '-')) return
                    let value = props?.type === "عدد" ? removeNonNumeric(e.target.value) : e.target.value;
                    props.onChange({ target: { value: value || '' } })
                    setValue(value)
                }}
                ref={parentRef}
                onKeyDown={onInputKeyDown}
            /> :
                <Creatable
                    elementConfig={props.elementConfig}
                    customRef={parentRef}
                    menuIsOpen={drop && !props.elementConfig?.disabled} //filterItems?.length > 0 && 
                    styles={{
                        container: (base) => ({
                            ...base,
                            display: (props.permanentOpen && props?.size === 0) ? "none" : "block",
                            maxWidth: "100%",
                            width: props.size ? "fit-content" : "100%",
                            ...props.inputContainer
                        }),
                        option: (base, state) => ({
                            ...base,
                            display: "flex",
                            fontSize: "13px",
                            padding: 0,
                            cursor: state.isSelected ? "default" : "pointer",
                            ...props.inputStyle,
                        }),
                        menuList: (base) => ({
                            ...base,
                            margin: "0.5em",
                        }),
                        singleValue: (base) => ({ ...base, userSelect: "auto", lineHeight: "19px" }),
                        menuPortal: (base) => ({ ...base, zIndex: props.highZIndex ? 2602 : 100 }),
                        loadingMessage: (base) => ({ ...base, padding: "0.2em 1em", fontSize: "14px", ...props.inputStyle }),
                        noOptionsMessage: (base) => ({ ...base, padding: "0.2em 1em", fontSize: "14px", ...props.inputStyle }),
                        input: (base) => ({ ...base, padding: "0", margin: "0" }),
                        valueContainer: (base) => ({
                            ...base,
                            padding: "0.2em calc(0.4em - 2px)",
                            margin: "0",
                            width: props.size ? getTextWidth([...new Array(parseInt(props.size))].map(item => 'ک').join('')) : "100%",
                            ...props.inputStyle
                        }),
                        menu: (base) => ({
                            ...base,
                            minWidth: props.fitMenu ? "unset" : "fit-content",
                            zIndex: 100,
                            backgroundColor: "var(--surface)",
                            color: "var(--on-surface)",
                            boxShadow: addMode ? "0 0 0 2px var(--primary), 0 4px 11px hsla(0, 0%, 0%, 0.2)"
                                : "0 0 0 1px var(--border), 0 4px 11px hsla(0, 0%, 0%, 0.2)"
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
                            primary: 'var(--primary-variant)',
                            primary75: 'var(--primary)',
                            primary50: 'var(--secondary)',
                            primary25: 'var(--secondary-variant)',
                        },
                    })}
                    onCreateOption={() => setSearchValue('')}

                    components={{ Option, Control }}
                    placeholder={props.size ? props.size < 10 ? '-' : (props.placeholder || props.type) : (props.placeholder || props.type)}
                    onChange={(newValue, opt) => {
                        itemClickHandler(addMode ? `${props.value} ${newValue.value}` : newValue, opt?.action === 'select-option')
                    }}
                    value={props.value === 0 ? { value: "0", label: "0" } : props.value ? { value: props.value, label: props.value } : ''}
                    inputValue={searchValue}
                    onInputChange={(value, event) => {
                        if (event.action === 'input-change')
                            setSearchValue(value);
                    }}
                    noOptionsMessage={() => (props.noOptionsMessage || t('not_found'))}
                    loadingMessage={() => t('loading')}
                    isLoading={drop && props.loading}
                    options={filterItems || []}

                    onMenuScrollToBottom={() => {
                        if (props.hasMore) setPageIndex(prev => prev + 1)
                    }}
                    menuPortalTarget={document.body}
                    minMenuHeight={300}
                    required={props.validation && props.validation.required}
                    isRtl={true}
                    isSearchable={props.searchable}
                    menuPlacement="auto"
                    tabSelectsValue={false}
                    isClearable={true}
                    backspaceRemovesValue={false}
                    formatCreateLabel={() => null}
                    onKeyDown={onInputKeyDown}
                />}
            {(props?.type === "عدد") && !isNaN(props.value) && (parseInt(props.value) > 999) &&
                <div
                    className="digit-seprated"
                    style={{
                        position: props.permanentOpen ? "relative" : "absolute",
                        top: props.permanentOpen ? "unset" : "100%",
                        width: props.size ? getTextWidth([...new Array(parseInt(props.size))].map(item => 'ک').join('')) : "100%",
                    }}>
                    {addCommas(props.value)}
                </div>
            }
        </div>
    )
})

export default TitleInput

const Option = (props) => {
    return (
        <components.Option {...props} >
            <div className="option-text" >
                {props.data.color && <div
                    className="color-dot"
                    style={{
                        backgroundColor: props.data.color || "var(--darken-border)"
                    }}
                />}
                <span>
                    {toLangDigits(props.data.label)}
                </span>
            </div>
            {props.data.secondText &&
                <span className="option-second-text">
                    {toLangDigits(props.data.secondText)}
                </span>
            }
        </components.Option>
    );
};

const Control = (props) => {
    const [value, setValue] = useState('');

    const { t } = useTranslation();

    const onChange = (e) => {
        if (props.selectProps.placeholder === "عدد" && (e.nativeEvent.data === '+' || e.nativeEvent.data === '-')) return
        let targetValue = props.selectProps.placeholder === "عدد" ? removeNonNumeric(e.target.value) : e.target.value;
        setValue(targetValue)
        props.selectProps.onInputChange(targetValue, { action: 'input-change' })
        props.selectProps.onChange(targetValue, {})
    }

    useEffect(() => {
        // if (!(props.selectProps?.value?.value)) return
        if (value !== props.selectProps?.value?.value) setValue(props.selectProps?.value?.value || '')
    }, [props.selectProps?.value?.value]);

    return (
        <components.Control {...props}  >
            <input
                autoComplete='off'
                {...props.selectProps.elementConfig}
                className={`input-element`}
                value={value}
                placeholder={t(props.selectProps.placeholder)}
                style={{
                    ...props.selectProps.styles.valueContainer(),
                    border: "none",
                }}
                ref={props.selectProps?.customRef}
                onChange={onChange}
                onClick={(e) => { if (e.detail === 2) props.selectProps.onKeyDown({ keyCode: 112 }) }}
            />
            {props.selectProps.isLoading && <Loading classes={props.selectProps?.elementConfig?.dir === "ltr" ? ['right-loading'] : ['']} />}
        </components.Control>
    );
};