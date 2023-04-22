import { toast } from 'react-toastify';
import '../../../node_modules/react-toastify/dist/ReactToastify.css';

export const notify = (msg) => {
    toast.success(msg, {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}