import './SwitchInput.scss'
import Switch from "react-switch";

const SwitchInput = (props) => {
    return (
        <div
            className='switch-input-container'
            onBlur={props.onExit}
        >
            {props.title && <p className='switch-input-title'>{props.title}</p>}
            <Switch
                onChange={props.onChange}
                checked={props.value}
                className={`${props.equal ? props.value ? 'switch-equal-checked' : 'switch-equal-unchecked' : props.value ? 'switch-input-checked' : 'switch-input-unchecked'}`}
                uncheckedIcon={false}
                checkedIcon={false}
                height={15}
                width={25}
            />
        </div>
    )
}

export default SwitchInput
