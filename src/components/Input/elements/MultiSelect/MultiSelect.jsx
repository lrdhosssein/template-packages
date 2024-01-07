/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react"
import "./MultiSelect.scss"
import useOnClickOutside from "../../../../hooks/useOnClickOutside";
import Loading from "../../../loading/loading";
import { useTranslation } from "react-i18next";
import Select, { components } from 'react-select';
import { getTextWidth } from "../../../../utils/pureFunctions";
// import makeAnimated from 'react-select/animated';
import { v4 as uuidv4 } from "uuid";
import { splitChar } from "../../../../constants";
import { BsList } from "react-icons/bs";
import { IoIosShareAlt } from "react-icons/io";
import useTextIsFit from "../../../../hooks/useTextIsFit";
import tippy from "tippy.js";
import toLangDigits from "../../../../utils/toLangDigits";

// const animatedComponents = makeAnimated();

const MultiSelect = (props) => {
    const [drop, setDrop] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [filterItems, setFilterItems] = useState([])
    const [pageIndex, setPageIndex] = useState(1);
    const [lock, setLock] = useState(true)
    const [createdValue, setCreatedValue] = useState([]);

    const { t } = useTranslation();
    const divRef = useRef();
    const inRef = useRef();
    const parentRef = useRef()

    useOnClickOutside(inRef, divRef, () => {
        setDrop(false);
    });

    const onBlur = () => {
        props.onExit && props.onExit()
    }

    const onFocus = () => {
        props.onEnter && props.onEnter(searchValue)
        setLock(false)
    }

    const handleChange = (e) => {
        const isAll = (e.findIndex(value => value.id === "all") > -1) && (createdValue?.findIndex(value => value.id === "all") === -1);
        if (isAll) {
            props.onChange([{ id: "all", value: t('all_items'), label: t('all_items') }]);
            setDrop(false);
        } else {
            const value = e.filter(value => value.id !== "all");
            props.onChange(value);
            props.closeOnSelect && setDrop(false);
        }
    };

    const handleKeyDown = (e) => {
        if (props.permanentOpen || props.checkKeyDown) {
            switch (e.keyCode) {
                case 46: //Del
                    e.preventDefault();
                    props.onChange([]);
                    break;
                case 112: //F1
                    e.preventDefault();
                    setDrop(true);
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
        if (updatedItems.length > 1)
            updatedItems = [{ id: "all", text: t('all_items') }, ...updatedItems];

        let updatedFilterItems = [...updatedItems.map(item => (
            {
                ...item,
                value: item.value || item.text,
                label: item.label || item.text,
            }
        ))
        ]
        setFilterItems(updatedFilterItems)
    }, [searchValue, props.items])

    useEffect(() => {
        if (!props.backSearch)
            return
        if (!props.items || props.items.length === 0) {
            setFilterItems([])
            return;
        }
        let updatedItems = [...props.items];
        if (updatedItems.length > 1)
            updatedItems = [{ id: "all", text: t('all_items') }, ...updatedItems];
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
        let updatedValue = [];
        if (props.value instanceof Array) {
            updatedValue = props.value.map(value => typeof value === "string" ? ({ id: uuidv4().replace(new RegExp("-", "gi"), ""), value: value, text: value, label: value }) : value);
        } else if (props.value) {
            if (`${props.value}`.split(splitChar).length === props.totalCount)
                updatedValue = [{ id: "all", value: t('all_items'), label: t('all_items') }]
            else
                updatedValue = `${props.value}`.split(splitChar).map(item => ({ id: uuidv4().replace(new RegExp("-", "gi"), ""), value: item, text: item, label: item }));
        }
        setCreatedValue(updatedValue);
    }, [props.value]);

    return (
        <div
            className='multi-select-container'
            style={{
                width: props.size ? 'fit-content' : "100%",
                ...props.inputContainer
            }}
        >
            <div className='title-class-name'
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
            </div>
            <Select
                ref={parentRef}
                id={props.elementConfig?.id}
                isDisabled={props.elementConfig?.disabled}
                styles={{
                    container: (base) => ({
                        ...base,
                        maxWidth: "100%",
                        height: "100%",
                        width: props.size ? "fit-content" : "100%",
                        ...props.inputContainer
                    }),
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                        boxShadow: "none",
                        flexWrap: "nowrap",
                        fontSize: "14px",
                        lineHeight: "18px",
                        minHeight: "fit-content",
                        ...props.inputStyle,
                        borderColor: state.isFocused ? "var(--primary)" : props.inputStyle?.borderColor || "var(--border)"
                    }),
                    option: (base, state) => ({
                        ...base,
                        display: "flex",
                        fontSize: "13px",
                        lineHeight: "25px",
                        padding: "0 4px",
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
                        minWidth: props.fitMenu ? "unset" : "fit-content",
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
                        padding: "calc(2px - 0.19px)",
                        width: props.size ? getTextWidth([...new Array(parseInt(props.size))].map(item => 'ک').join('')) : "100%",
                        overflowX: "scroll",
                        flexWrap: "nowrap",
                        "&::-webkit-scrollbar": {
                            height: "2px"
                        },
                    }),
                    multiValue: (base) => ({
                        ...base,
                        borderRadius: 25,
                        padding: 0,
                        margin: "0 0 0 2px",
                        minWidth: "unset",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }),
                    multiValueLabel: (base) => ({
                        ...base,
                        padding: 1,
                        paddingRight: 5
                    }),
                    multiValueRemove: (base) => ({
                        ...base,
                        borderRadius: 25,
                        padding: 0,
                        marginLeft: 2
                    }),
                    placeholder: (base) => ({
                        ...base,
                        opacity: 0.5
                    }),
                }}
                classNames={{
                    control: () => `multi-select-input ${(props.invalid && props.shouldValidate && props.touched) ? "invalid" : ""}`,
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
                isMulti
                menuPosition="fixed"
                components={{ LoadingIndicator: Loading, IndicatorSeparator: props.config?.multiRef ? BsList : null, ClearIndicator: null, Option, MultiValueLabel }}
                placeholder={props.size ? props.size < 10 ? '-' : t(props.placeholder || 'select') : t(props.placeholder || 'select')}
                onChange={handleChange}
                value={createdValue}
                noOptionsMessage={() => t('not_found')}
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
                closeMenuOnSelect={false}
                menuIsOpen={drop}
                onMenuOpen={() => setDrop(true)}
                onMenuClose={() => setDrop(false)}
                listItemStyle={props.listItemStyle}
            />
        </div>
    )
}

export default MultiSelect

const Option = (props) => {
    const { t } = useTranslation();
    return (
        <components.Option {...props} >
            <p
                title={props.data?.editor && `${t('edit')} : ${props.data?.editor}`}
                style={props.selectProps.listItemStyle}
            >
                {`${toLangDigits(props.data.label)}`.replaceAll(splitChar, ", ")}
            </p>
            {props.data.secondText &&
                <p className="option-second-text" style={props.selectProps.listItemStyle}>
                    {props.data.secondText === 'shared'
                        ? <IoIosShareAlt title={props.data?.by} />
                        : `${toLangDigits(props.data.secondText)}`.replaceAll(splitChar, ", ")
                    }
                </p>
            }
        </components.Option>
    );
};

const MultiValueLabel = (props) => {

    const textRef = useRef(null);

    const { showHint } = useTextIsFit(`${props.children}`, textRef, 120);

    useEffect(() => {
        if (!props.children || !showHint) return;
        tippy('#multi_value_label_hint', {
            animation: "scale",
            touch: ['hold', 500],
            duration: [150, 0],
            delay: [200, 0],
            theme: localStorage.getItem('darkMode') === "enabled" ? 'light-border' : "sijam"
        });
    }, [props.children, showHint]);

    return (
        <components.MultiValueLabel {...props} >
            <div
                id={`multi_value_label${showHint ? '_hint' : ''}`}
                ref={textRef}
                style={{
                    maxWidth: "120px",
                    lineHeight: "15px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden"
                }}
                data-tippy-content={`${toLangDigits(props.children)}`}
            >
                {toLangDigits(props.children)}
            </div>
        </components.MultiValueLabel>
    );
};