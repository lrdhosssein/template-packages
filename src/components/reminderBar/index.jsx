import "./reminderBar.scss";
import PropTypes from 'prop-types'
import { RiCloseCircleFill } from "react-icons/ri";

const ReminderBar = ({ children, onClose, color, onClick }) => {

    const handleClose = () => {
        onClose()
    }

    const handleClick = () => {
        if (!onClick) return
        onClick();
    }

    return (
        <div
            className={`reminder-bar`}
            onClick={handleClick}
            style={{
                "--reminder-bar-back-color": color || "#383838"
            }}
        >
            {onClose &&
                <RiCloseCircleFill className="icon-close" onClick={onClose && handleClose && handleClose} />
            }
            {children}
        </div>
    );
};


ReminderBar.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func,
}

ReminderBar.defaultProps = {
    onClose: undefined,
}



export default ReminderBar;
