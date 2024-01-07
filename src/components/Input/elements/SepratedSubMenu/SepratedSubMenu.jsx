import "./SepratedSubMenu.scss";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { baseUrl } from "../../../../constants/Config";
import { useTranslation } from "react-i18next"
import RadioButton from "../RadioButton/RadioButton";
import Default from "../../../../assets/images/default.png";
import Button, { buttonTypes } from "../../../Button/Button";
import { FaTrashCan } from "react-icons/fa6";

const SepratedSubMenu = (props) => {
    const { disabled, onChange } = props;
    const { t } = useTranslation();

    const { selectedActiveBackup } = useSelector((state) => state.simam);

    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const backupId = searchParams.get("backup");

    const onInputFocus = () => {
        props.onEnter && props.onEnter()
    }

    const onInputBlur = () => {
        props.onExit && props.onExit()
    }

    return (
        <div
            disabled={disabled}
            className="seprated-sub-menu-container"
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            style={{ width: props.size ? 'fit-content' : "100%", ...props.inputContainer }}
        >
            <div
                className='title-class-name'
                style={{
                    margin: props.title ? "0 0.2em 0.2em" : "0",
                    ...props.titleStyle,
                }}
            >
                {props.HPTitle || props.title}
                {(props.validation) && (props.validation.required &&
                    <span className="required">
                        *
                    </span>
                )}
                {props.value &&
                    <Button
                        buttonType={buttonTypes.secondary}
                        style={{
                            padding: "0 5px",
                        }}
                        classes={['small-gap-hor']}
                        clicked={() => onChange('')}
                    >
                        <FaTrashCan className="error-color" size={10} />
                    </Button>
                }
            </div>
            <div
                className="seprated-sub-menu-items"
                style={{
                    maxHeight: props?.height > 0 ? `${props.height}px` : 270,
                }}
            >
                {props.items?.length > 0 ?
                    props.items.map(subMenu =>
                        props.subItemType === "image" ?
                            <div
                                key={subMenu.id}
                                className={`sub-menu-item ${props.value === subMenu.id && 'selected-sub-menu'}`}
                                onClick={() => onChange(`${subMenu.text}`)}
                            >
                                {subMenu.secondText ?
                                    <img src={`${baseUrl}uploads/data/${(backupId || selectedActiveBackup)}/${subMenu.secondText}`} alt={subMenu.text} />
                                    :
                                    <img className="default-image" src={Default} alt={subMenu.text} />
                                }
                                <span className="sub-menu-item-name">
                                    {subMenu.text}
                                </span>
                            </div>
                            :
                            <RadioButton
                                key={subMenu.id}
                                label={subMenu.text}
                                checked={props.value === subMenu.id}
                                onChange={() => onChange(`${subMenu.text}`)}
                            />
                    )
                    :
                    <div className="sub-menu-not-exist">
                        {t('not_exist')}
                    </div>
                }
            </div>
        </div>
    );
};

export default SepratedSubMenu;
