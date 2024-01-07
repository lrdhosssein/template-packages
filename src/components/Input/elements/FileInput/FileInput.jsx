/* eslint-disable react-hooks/exhaustive-deps */
import "./FileInput.scss";
import { detectFileType, getTextWidth } from "../../../../utils/pureFunctions";
import { useEffect, useRef, useState } from "react";
import { VscFile } from "react-icons/vsc";
import { MdOutlineAdd } from "react-icons/md";
import Button, { buttonTypes } from "../../../Button/Button";
import { MdClose, MdAttachFile, MdAudiotrack } from "react-icons/md";
import {
    BsFileEarmarkPdfFill,
    BsFileEarmarkWordFill,
    BsFileEarmarkExcelFill,
    BsFillFileEarmarkTextFill,
    BsFillFileEarmarkPlayFill,
    BsFillFileEarmarkMusicFill,
    BsFileEarmarkImageFill
} from "react-icons/bs";
import { IoDocumentAttach, IoVideocam } from "react-icons/io5";
import Modal from "../../../Modal/Modal";
import FileViewer from "../../../FileViewer/FileViewer";
import FilePreview from "../../../FilePreview/FilePreview";
import tippy from 'tippy.js';

const FileInput = (props) => {
    const [focus, setFocus] = useState(false);
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [fileType, setFileType] = useState(null);
    const [fileIcon, setFileIcon] = useState(null);
    const [fileColor, setFileColor] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [openFile, setOpenFile] = useState(false);

    const fileRef = useRef();
    const containerRef = useRef();

    const onFocusHandler = () => {
        setFocus(1);
        setShowPreview(true);
    }

    const onBlurHandler = () => {
        setFocus(0);
        setShowPreview(false);
    }

    const onEnterHandler = () => {
        if (focus === 1) return;
        setFocus(2);
        setShowPreview(true);
    }

    const onLeaveHandler = () => {
        if (focus === 1) return;
        setFocus(0);
        setShowPreview(false);
    }

    const clearFileHandler = (e) => {
        e.stopPropagation();
        setFile(null);
        setFileDataURL(null);
        if (fileRef.current) fileRef.current.value = '';
        props.onChange({ target: { value: '' } })
    }

    const inputClickHandler = () => {
        if (props.elementConfig?.readOnly || props.disabled) return;
        if (fileDataURL)
            openFileHandler()
        else
            fileRef.current.click()
    }

    const inputKeyDownHandler = (e) => {
        if (e.keyCode !== 32) return;  // Space
        inputClickHandler();
    }

    const onChangeHandler = (e) => {
        if (!e.target.files.length) return;
        let value = e.target.files[0], url = URL.createObjectURL(e.target.files[0]);
        setFile(value);
        props.onChange({ target: { value: value || '' } })
        setFileDetails(value.name, url);
    }

    const setFileDetails = (fileName, url) => {
        let type = detectFileType(fileName.split('.')[fileName.split('.').length - 1]);
        setFileType(type);
        setFileDataURL(url);
        switch (type) {
            case "text":
                setFileIcon(<BsFillFileEarmarkTextFill color="rgb(255, 191, 0)" />)
                setPreviewFile("T")
                setFileColor("rgb(255, 191, 0)")
                break;
            case "audio":
                setFileIcon(<BsFillFileEarmarkMusicFill color="rgb(228, 90, 12)" />)
                setPreviewFile(<MdAudiotrack />)
                setFileColor("rgb(228, 90, 12)")
                break;
            case "video":
                setFileIcon(<BsFillFileEarmarkPlayFill color="rgb(0, 108, 234)" />)
                setPreviewFile(<IoVideocam />)
                setFileColor("rgb(0, 108, 234)")
                break;
            case "pdf":
                setFileIcon(<BsFileEarmarkPdfFill color="rgb(244, 15, 2)" />)
                // setPreviewFile(<SiAdobeacrobatreader />)
                setPreviewFile(
                    <object data={url} type="application/pdf" width="100%" height="100%">
                    </object>
                )
                // setFileColor("rgb(244, 15, 2)")
                setFileColor(null)
                break;
            case "word":
                setFileIcon(<BsFileEarmarkWordFill color="rgb(0, 83, 155)" />)
                setPreviewFile("W")
                setFileColor("rgb(0, 83, 155)")
                break;
            case "excel":
                setFileIcon(<BsFileEarmarkExcelFill color="rgb(15,117,60)" />)
                setPreviewFile("X")
                setFileColor("rgb(15,117,60)")
                break;
            case "image":
                setFileIcon(<BsFileEarmarkImageFill color="var(--primary)" />)
                setPreviewFile(<img src={url} alt="" />)
                setFileColor(null)
                break;

            default:
                setFileIcon(<IoDocumentAttach color="var(--primary)" />)
                setPreviewFile(<MdAttachFile />)
                setFileColor("var(--primary)")
                break;
        }
    }

    const openFileHandler = () => {
        if (fileType === "image" || fileType === "pdf")
            setOpenFile(true)
    }

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
        <div className='file-input-container'
            style={{ width: props.size ? 'fit-content' : "100%", ...props.inputContainer }}
            ref={props.customRef}
        >
            <p
                className='title-class-name'
                style={{
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
                {
                    (props.permanentOpen && props?.size === 0 && props.value) && <span className='category-error-message'>{props.value}</span>
                }
            </p>
            <input
                type="file"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={onChangeHandler}
            />
            <div
                ref={containerRef}
                className={`input-element file-input ${(props.invalid && props.shouldValidate && props.touched && !props.disabled) ? "invalid" : ""}`}
                tabIndex={0}
                style={{
                    width: props.size ? getTextWidth([...new Array(parseInt(props.size))].map(item => 'ک').join('')) : "100%",
                    padding: "0.2em calc(0.4em - 2px)",
                    cursor: (!props.elementConfig?.readOnly && !props.disabled && focus === 2) ? "pointer" : "default",
                    ...props.inputStyle,
                }}
                {...props.elementConfig}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                onMouseEnter={onEnterHandler}
                onMouseLeave={onLeaveHandler}
                onMouseDown={(e) => e.preventDefault()}
                onClick={inputClickHandler}
                onKeyDown={inputKeyDownHandler}
            >
                {'ا'}
                {(!focus || props.elementConfig?.readOnly || props.disabled) && !fileDataURL && <p className="file-input-placeholder">{props.type}</p>}
                {fileDataURL ?
                    <div className="file">
                        {fileType === "image" ?
                            <img src={fileDataURL} alt="" />
                            : fileIcon
                        }
                        {focus > 0 && !openFile && !props.elementConfig?.readOnly && !props.disabled && <Button
                            buttonType={buttonTypes.secondary}
                            style={{
                                position: "absolute",
                                right: 5,
                                top: "50%",
                                transform: "translateY(-50%)",
                                padding: 0
                            }}
                            clicked={clearFileHandler}
                            buttonConfig={{ tabIndex: -1 }}
                        >
                            <MdClose size={13} />
                        </Button>}
                        {showPreview && !openFile &&
                            <FilePreview
                                fileColor={fileColor}
                                openFileHandler={openFileHandler}
                                previewFile={previewFile}
                                containerRef={containerRef}
                            />
                        }
                    </div>
                    :
                    !props.elementConfig?.readOnly && !props.disabled &&
                    <div className="add-file-button">
                        <VscFile className={`file-icon ${focus && 'show-file-icon'}`} />
                        <MdOutlineAdd className={`add-icon ${focus && 'show-add-icon'}`} />
                    </div>}
            </div>
            {openFile &&
                <Modal
                    show={openFile}
                    close={() => setOpenFile(false)}
                    style={{
                        padding: 0
                    }}
                >
                    <FileViewer
                        file={file}
                        type={fileType}
                        url={fileDataURL}
                        icon={fileIcon}
                        setOpenFile={setOpenFile}
                    />
                </Modal>
            }
        </div>
    );
};

export default FileInput;
