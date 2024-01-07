import { useState } from "react";
import Button, { buttonTypes } from "../../../components/Button/Button";
import Input, { elementTypes } from "../../../components/Input/Input";

const Home = () => {
    const [order, setOrder] = useState({
        input1: {
            type: elementTypes.checkbox,
            item: { id: "checkbox", text: "checkbox" },
            checked: false
        },
        input2: {
            title: "datePicker",
            type: elementTypes.datePicker,
            value: ''
        },
        input3: {
            title: "dropDown",
            type: elementTypes.dropDown,
            value: '',
            items: [{ id: 1, text: "item1" }, { id: 2, text: "item2" }]
        },
        input4: {
            title: "fileInput",
            type: elementTypes.fileInput,
            value: ''
        },
        input5: {
            type: elementTypes.input,
            value: ''
        },
        input6: {
            title: "multiSelect",
            type: elementTypes.multiSelect,
            value: '',
            items: [{ id: 1, text: "item1" }, { id: 2, text: "item2" }]
        },
        input7: {
            title: "OTP",
            type: elementTypes.otp,
            value: '',
            boxes: 5
        },
        input8: {
            title: "radioButton",
            type: elementTypes.radioButton,
            checked: false
        },
        input10: {
            title: "switchInput",
            type: elementTypes.switchInput,
            value: false
        },
        input11: {
            title: "timePicker",
            type: elementTypes.timePicker,
            value: ''
        },
        input12: {
            title: "titleInput",
            type: elementTypes.titleInput,
            value: ''
        },
        input13: {
            title: "titleTextArea",
            type: elementTypes.titleTextarea,
            value: ''
        },
    });

    const onChange = (key, e) => {
        let updatedOrder = { ...order };
        let upadtedElement = updatedOrder[key];
        if (typeof e === "object") {
            if (order[key].type === elementTypes.multiSelect || order[key].type === elementTypes.datePicker) {
                upadtedElement.value = e;
            }
            else if (order[key].type === elementTypes.checkbox || order[key].type === elementTypes.radioButton) {
                upadtedElement.checked = e.target.checked;
            }
            else {
                upadtedElement.value = e.target.value;
            }
        } else {
            upadtedElement.value = e;
        }
        updatedOrder[key] = upadtedElement;
        setOrder(updatedOrder);
    }

    return (
        <div className="grid p-10 grid-cols-5 gap-5 items-center">
            <Button
                buttonType={buttonTypes.primary}
            >
                Submit
            </Button>
            {Object.entries(order).map(([key, input]) =>
                <Input
                    key={key}
                    {...input}
                    elementType={input.type}
                    onChange={(e) => onChange(key, e)}
                />
            )}
        </div>
    );
};

export default Home;
