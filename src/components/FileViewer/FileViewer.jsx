import "./FileViewer.scss";
import Button, { buttonTypes } from "../Button/Button";
import { MdClose, MdFileDownload } from "react-icons/md";
import fileDownload from "js-file-download";
import { useTranslation } from "react-i18next";

const FileViewer = ({ type, url, icon, setOpenFile }) => {

    const { t } = useTranslation();

    const handleDownload = () => {
        switch (type) {
            case "pdf":
            case "image":
                window.open(url);
                break;

            default:
                fileDownload(url, url.split("/")[url.split("/").length - 1]);
                break;
        }
    };

    return (
        <div className="opened-file-modal">
            <div className="header-section">
                <div className="file-details">
                    <div className="file-icon">
                        {icon}
                    </div>
                    <p>
                        {/* {file.name} */}
                    </p>
                    <Button
                        buttonType={buttonTypes.secondary}
                        clicked={handleDownload}
                        style={{ fontSize: "1.2rem", padding: "0.3em" }}
                        title={t("download_file")}
                    >
                        <MdFileDownload />
                    </Button >
                </div>
                <Button
                    buttonType={buttonTypes.secondary}
                    style={{ padding: 0 }}
                    clicked={() => setOpenFile(false)}
                    buttonConfig={{ tabIndex: -1 }}
                >
                    <MdClose size={20} />
                </Button>
            </div>
            <div className="body-section">
                {type === "image" ?
                    <img src={url} alt="" />
                    : type === "pdf" &&
                    <object data={url} type="application/pdf" width="100%" height="100%">
                    </object>
                }
            </div>
        </div>
    );
};

export default FileViewer;
