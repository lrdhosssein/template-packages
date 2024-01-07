/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import MenuDropDown from "../MenuDropDown/MenuDropDown";
import "./FilePreview.scss";
import tippy from "tippy.js";

const FilePreview = ({ fileColor, openFileHandler, previewFile, containerRef }) => {

    useEffect(() => {
        if (!openFileHandler) return;
        const delay = setTimeout(() => {
            tippy('.file-preview-container', {
                animation: "scale",
                touch: ['hold', 500],
                duration: [150, 0],
                delay: 0,
                content: "کلیک: بزرگنمایی",
                theme: localStorage.getItem('darkMode') === "enabled" ? 'light-border' : "sijam"
            });
        }, 180);
        return () => {
            clearTimeout(delay);
        };
    }, []);

    return (
        <MenuDropDown
            divContainerRef={containerRef}
            onClick={() => { }}
            setDropDown={() => { }}
            divStyle={{
                background: "transparent",
                boxShadow: "none",
                backdropFilter: "none",
                marginTop: 0,
                marginBottom: 0
            }}
            offset={containerRef?.current?.getBoundingClientRect()}
        >
            <div className="file-preview-container">
                <div className="file-preview">
                    <div
                        className="file-preview-content"
                        style={{ backgroundColor: fileColor || 'var(--background)' }}
                    >
                        {previewFile}
                    </div>
                    <div className="clickable-layer" onClick={openFileHandler} />
                    {/* <p className="file-name" title={file.name}>
                    {file.name}
                </p> */}
                </div>
            </div>
        </MenuDropDown>
    );
};

export default FilePreview;