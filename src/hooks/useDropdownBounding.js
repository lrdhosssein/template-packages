/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';

function useDropdownBounding(ref) {
    const [bounding, setBounding] = useState({});

    const checkElementBounding = (rect) => {

        const clientHeight = (window.innerHeight || document.documentElement.clientHeight);
        const clientWidth = (window.innerWidth || document.documentElement.clientWidth);

        // Check if it's out of the viewport on each side
        var out = {};
        out.top = rect.top > clientHeight - rect.bottom;
        out.bottom = rect.top < clientHeight - rect.bottom;
        out.left = rect.left > clientWidth - rect.right;
        out.right = rect.left < clientWidth - rect.right;

        return out;
    };

    useEffect(() => {
        if (!ref?.current) return;
        const bounding = checkElementBounding(ref?.current?.getBoundingClientRect());
        setBounding(bounding);
    }, [ref?.current]);

    return { bounding }
}

export default useDropdownBounding;