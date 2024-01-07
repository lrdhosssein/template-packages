import { useEffect } from "react";
import NotFound from "../assets/images/404 Page Animation.gif";

const NotFoundPage = () => {

    useEffect(() => {
        document.title = 'صفحه مورد نظر یافت نشد!';
    }, []);

    return (
        <div
            className="min-h-screen text-3xl font-bold text-gray-600 
                    flex flex-col justify-center items-center select-none"
        >
            <span>
                {`صفحه یافت نشد!`}
            </span>
            <img src={NotFound} alt="404 not found" draggable={false} className="w-[500px]" />
        </div>
    );
};

export default NotFoundPage;
