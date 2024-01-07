import { Route, Routes } from "react-router-dom";
import Main from "../pages/Main";
import NotFoundPage from "../pages/NotFoundPage";

const Body = () => {
    return (
        <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
    );
};

export default Body;
