import { memo } from "react";
import "./Modal.scss";
import Backdrop from "../Backdrop/Backdrop";
import { createPortal } from "react-dom";

const Modal = memo(({ show, close, bdStyle, classNames, style, children }) => {
  return createPortal((
    <div className="modal-overlay" style={{ display: show ? "flex" : "none" }}>
      <Backdrop style={bdStyle} show={show} clicked={close}></Backdrop>
      <div
        className={`modal rounded-xl animate-popIn bg-white ${classNames?.join(" ")}`}
        style={{
          opacity: show ? 1 : 0,
          pointerEvents: show ? "auto" : "none",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  ),
    document.getElementById("portal")
  );
});
export default Modal;
