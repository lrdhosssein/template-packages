import Button, { buttonTypes } from "../Button/Button";

const ModalAlert = ({ title, question, cancel, confirm }) => {
    return (
        <div className="flex flex-col items-center gap-3 font-iransans">
            <span className="font-semibold text-xl my-3">
                {title}
            </span>
            <span className="font-light mb-3">
                {question}
            </span>
            <div className="flex gap-1">
                <Button
                    buttonType={buttonTypes.third}
                    clicked={cancel}
                >
                    انصراف
                </Button>
                <Button
                    clicked={confirm}
                >
                    بله
                </Button>
            </div>
        </div>
    );
};

export default ModalAlert;
