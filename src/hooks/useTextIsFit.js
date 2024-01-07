/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

export default function useTextIsFit(text, textRef, maxwidth) {
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        if (textRef?.current?.clientWidth >= maxwidth) {
            setShowHint(true);
        } else {
            setShowHint(false);
        }
    }, [text, textRef, maxwidth]);

    return { showHint };
}