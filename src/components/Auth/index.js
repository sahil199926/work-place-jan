import React, { useContext } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../../FirebaseConfig";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import toastMessage from "../../util/toastMessage";

function Auth({ type }) {
  const [state, dispatch] = useContext(userContext);
  const navigate = useNavigate();
  const signIn = () => {
    console.log("sign in");
    const provider = new GoogleAuthProvider();
    //signInWithPopup will open a popup window for the user to sign in with Google
    //signInWithPopup(auth , provider)
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result, "result");
        const { user } = result;
        const { displayName, email, photoURL, uid } = user;
        dispatch({
          type: "LOGIN",
          payload: {
            type,
            displayName,
            email,
            photoURL,
            uid,
          },
        });

        // check if user is in there in our database
        // const q= await query(collection(db, "userInfo"), where("userId", "==", uid))
        const docRef = doc(db, "userInfo", uid);
        const docSnap = await getDoc(docRef);
        let userData=null
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          userData=docSnap.data()
          dispatch({
            type: "UPDATE",
            payload: docSnap.data(),
          });
          // 1 user is in there in our database
          //1.1 user is stored as candidate and {type === "candidate"}, then redirect to candidate profile
          //1.2 user is stored as employer  but {type==="candidate"}, show error message
          //1.3 user is stored as candidate but {type==="employer"}, show error message
          //1.4 user is stored as employer and {type==="employer"}, then redirect to employer profile

          if (type === "candidate") {
            if (
              userData.userType==="candidate"
              // user is stored as candidate
            ) {
              navigate("/candidate/profile");
            } else {
              // show error message
              toastMessage({
                message: "You are not a candidate",
                type: "error",
              })
            }
          } else {
            if (
              userData.userType==="employer"
              // user is stored as employer
            ) {
              navigate("/employer/profile");
              // redirect to employer profile
            } else {
              toastMessage({
                message: "You are not an employer",
                type: "error",
              })
              // show error message
            }
          }
        

        } else {
          if (type === "candidate") {
            // redirect to candidate onboarding page
            navigate("/candidate/onboarding");
          } else {
            // redirect to employer onboarding page
            navigate("/employer/onboarding");
          }
        }

       

        // // 2 user is not there in our database
        // // if user is candidate means {type === "candidate"}, then redirect to candidate onboarding page
        // // if user is employer means {type === "employer"}, then redirect to employer onboarding page

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.log(error, "error");
        // ...
      });
  };

  return (
    <div className="auth-container">
      <h1>Welcome {type}</h1>
      <h2>Sign In</h2>
      <button onClick={signIn}>Google</button>
    </div>
  );
}

export default Auth;
