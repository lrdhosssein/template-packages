/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Home from '../features/landing';

const Main = () => {
    const [body, setBody] = useState(null);

    const location = useLocation();

    useEffect(() => {
        document.title = "My App";
        setBody(<Home />)
    }, [location.pathname])

    return (
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
            {body}
        </div>
    );
};

export default Main;
