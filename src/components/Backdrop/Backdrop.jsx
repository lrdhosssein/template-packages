
const Backdrop = (props) => {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm animate-fadeIn z-[2501]"
      onClick={props.clicked}
      style={{
        // backgroundColor: themeState.isDark ? "rgba(250, 250, 250, 0.4)" : "rgba(0, 0, 0, 0.3)",
        opacity: props.show ? 1 : 0,
        pointerEvents: props.show ? "auto" : "none",
        ...props.style,
      }}
    ></div>
  );
};

export default Backdrop;
