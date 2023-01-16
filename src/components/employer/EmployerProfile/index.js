import { Button, Grid, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../../context/userContext";
import { auth, db } from "../../../FirebaseConfig";
import Dropdown from "../../common/Dropdown";
import FileUpload from "../../common/FileUpload";
import { industryType, companySize } from "../../../constant";
import "./onboarding.css";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toastMessage from "../../../util/toastMessage";
function EmployerProfile() {
  const [state, dispatch] = useContext(userContext);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({
    companyName: "",
    companyPhone: "",
    companyEmail: "",
    industryType: "",
    companySize: "",
    companyLocation: "",
    companyWebsite: "",
    companyTagline: "",
    companyBio: "",
    companyLogo: "",
  });
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    dispatch({
      type: "LOGOUT",
    });
    navigate("/employer/auth");
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
    try {
      await setDoc(doc(db, "userInfo", userId), {
        ...userData,
        userType: "employer",
      });
      toastMessage({
        message: "Profile created successfully",
        type: "success",
      });
      navigate("/employer/profile");
    } catch (err) {
      console.log(err);
      toastMessage({ message: err.message, type: "error" });
    }
  };
  const fetchUserData = async () => {
    // get user data from firestore from userInfo collection with uid

    const docRef = doc(db, "userInfo", state.userInfo.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    loading ? (
      <div>loading</div>
    ) : (
    <form onSubmit={(e) => submit(e)}>
      <Grid className="onboarding-container" container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              marginRight: "10px",
            }}
            onClick={() => setIsEdit((p) => !p)}
          >
            {isEdit ? "cancel" : "Edit"}
          </Button>
          <Button variant="contained" color="primary" onClick={logout}>
            Logout
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">Company Name</div>
          <TextField
            size="small"
            disabled={!isEdit}
            fullWidth
            value={userData.companyName}
            required
            onChange={(e) =>
              setUserData({ ...userData, companyName: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">email</div>
          <TextField
            size="small"
            fullWidth
            disabled
            required
            value={userData.companyEmail}
            onChange={(e) =>
              setUserData({ ...userData, companyEmail: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">phone NO.</div>
          <TextField
            size="small"
            disabled={!isEdit}
            fullWidth
            required
            value={userData.companyPhone}
            onChange={(e) =>
              setUserData({ ...userData, companyPhone: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">Industry Type</div>
          <Dropdown
            disabled={!isEdit}
            dropdowndata={industryType}
            onChange={(newval) =>
              setUserData({ ...userData, industryType: newval })
            }
            value={userData.industryType}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className="label">Company size</div>
          <Dropdown
            disabled={!isEdit}
            dropdowndata={companySize}
            onChange={(newval) =>
              setUserData({ ...userData, companySize: newval })
            }
            value={userData.companySize}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <div className="label">Company Location</div>
          <TextField
            disabled={!isEdit}
            size="small"
            fullWidth
            value={userData.companyLocation}
            onChange={(e) =>
              setUserData({ ...userData, companyLocation: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <div className="label">Company Website</div>
          <TextField
            disabled={!isEdit}
            size="small"
            fullWidth
            value={userData.companyWebsite}
            onChange={(e) =>
              setUserData({ ...userData, companyWebsite: e.target.value })
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <div className="label">Company Tagline</div>
          <TextField
            disabled={!isEdit}
            size="small"
            fullWidth
            value={userData.companyTagline}
            onChange={(e) =>
              setUserData({ ...userData, companyTagline: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <div className="label">bio</div>
          <TextField
            minRows={5}
            multiline
            disabled={!isEdit}
            size="small"
            fullWidth
            value={userData.companyBio}
            onChange={(e) =>
              setUserData({ ...userData, companyBio: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <div className="label">Company Logo</div>
          <FileUpload
            disabled={!isEdit}
            required={true}
            onUpload={(url) => setUserData({ ...userData, companyLogo: url })}
            value={userData.companyLogo}
            type="image"
          />
        </Grid>
        <Grid item xs={12}>
          {isEdit && (
            <Button
              disabled={
                !userData.companyName ||
                !userData.companyPhone ||
                !userData.companyEmail ||
                !userData.industryType ||
                !userData.companySize ||
                !userData.companyLocation ||
                !userData.companyTagline ||
                !userData.companyLogo
              }
              variant="contained"
              type="submit"
              color="primary"
            >
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
    )
  );
}

export default EmployerProfile;
