import { Store } from "react-notifications-component";

export default function toastMessage({ message, type}) {
  if(type==='success'){
    Store.addNotification({
      title: "Wonderful!",
      message: message,
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: true
      }
    });
   
  }
  else if(type==='error'){
    Store.addNotification({
      title: "Error!",
      message: message,
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: true
      }
    });
  }
  else if(type==='warning'){
    Store.addNotification({
      title: "Warning!",
      message: message,
      type: "warning",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: true
      }
    });
  }

  else{
    alert(message)
  }
}