/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

function useOnClickOutside(divContainerRef = null, ref = null, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (
                ref &&
                (!ref.current ||
                    ref.current.contains(event.target))
            ) {
                return;
            }
            if (
                divContainerRef &&
                (!divContainerRef.current ||
                    divContainerRef.current.contains(event.target))
            ) {
                return;
            }
            handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}

export default useOnClickOutside;
