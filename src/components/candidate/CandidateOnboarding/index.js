import { Button, Grid, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../../context/userContext";
import { auth, db } from "../../../FirebaseConfig";
import Dropdown from "../../common/Dropdown";
import SearchDropdown from "../../common/SearchDropdown";
import FileUpload from "../../common/FileUpload";
import { primaryRole, skills } from "../../../constant";
import "./onboarding.css";
import { doc, setDoc } from "firebase/firestore";
import toastMessage from "../../../util/toastMessage";
function CandidateOnboarding() {
  const [state, dispatch] = useContext(userContext);
  const [userData, setUserData] = useState({
    name: state.userInfo.displayName,
    email: state.userInfo.email,
    photo: "",
    uid: "",
    phoneNumber: "",
    primaryRole: "",
    linkedin: "",
    skills: [],
    bio: "",

    resume: "",
  });
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    dispatch({
      type: "LOGOUT",
    });
    navigate("/candidate/auth");
  };

  const handleSkills = (newval) => {
    console.log(newval);
    if (userData.skills.includes(newval.value)) return;
    else {
      setUserData({ ...userData, skills: [...userData.skills, newval.value] });
    }
  };
  const handleDelete = (item) => {
    setUserData({
      ...userData,
      skills: userData.skills.filter((skill) => skill !== item),
    });
  };
  useEffect(() => {
    console.log(state);
  }, [userData]);
  const submit = async (e) => {
    e.preventDefault();
    console.log(userData);
    // upload to firebase
    //setDoc(docref, data)
    //doc (db ref, collection name, doc id)
const userId = state.userInfo.uid;
try{
    await setDoc(doc(db, "userInfo", userId), {

      ...userData,
      userType: "candidate",
    });
    toastMessage({message:'Profile created successfully',type:'success'})
    navigate("/candidate/profile");
  }
  catch(err){
    console.log(err)
    toastMessage({message:err.message,type:'error'})
  }
  };
  return (
    <form onSubmit={(e) => submit(e)}>
      <Grid className="onboarding-container" container spacing={3}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={logout}>
            Logout
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">Name</div>
          <TextField
            size="small"
            fullWidth
            value={userData.name}
            required
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">email</div>
          <TextField
            size="small"
            fullWidth
            disabled
            required
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">phone NO.</div>
          <TextField
            size="small"
            fullWidth
            required
            value={userData.phoneNumber}
            onChange={(e) =>
              setUserData({ ...userData, phoneNumber: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">primary Role</div>
          <Dropdown
            dropdowndata={primaryRole}
            onChange={(newval) =>
              setUserData({ ...userData, primaryRole: newval })
            }
            value={userData.primaryRole}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">linkedin</div>
          <TextField
            size="small"
            fullWidth
            value={userData.linkedin}
            onChange={(e) =>
              setUserData({ ...userData, linkedin: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">skills</div>
          <SearchDropdown
            dropdowndata={skills}
            onChange={(newval) => handleSkills(newval)}
            values={userData.skills}
            handleDelete={handleDelete}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">bio</div>
          <TextField
            size="small"
            fullWidth
            value={userData.bio}
            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <div className="label">resume</div>
          <FileUpload
            required={true}
            onUpload={(url) => setUserData({ ...userData, resume: url })}
            value={userData.resume}
            type="file"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            disabled={
              userData.name === "" ||
              userData.email === "" ||
              userData.phoneNumber === "" ||
              userData.primaryRole === "" ||
              userData.resume === "" ||
              userData.skills.length === 0
            }
            variant="contained"
            type="submit"
            color="primary"
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default CandidateOnboarding;

// user name
// user email
//! user photo
//! user uid
// phone number
// linkedin
// bio
// skills []
// primary role
// resume
