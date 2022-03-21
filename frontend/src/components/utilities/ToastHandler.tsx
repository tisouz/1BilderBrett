import { toast, ToastOptions } from "react-toastify";

// Display in-app pop-up notifications to inform user
//notifications will close on click or after 3 seconds
export default function notify(notifymsg: string, type: string) {
  let options: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  if (type === "info") {
    toast.info(notifymsg, options);
  } else if (type === "success") {
    toast.success(notifymsg, options);
  } else if (type === "warning") {
    toast.warning(notifymsg, options);
  } else if (type === "error") {
    toast.error(notifymsg, options);
  } else {
    toast(notifymsg, options);
  }
}
