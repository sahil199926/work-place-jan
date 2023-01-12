import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../../context/userContext';
import {auth} from '../../../FirebaseConfig'
function CandidateOnboarding() {
  const [state, dispatch] = useContext(userContext);
  const navigate=useNavigate()
  const logout = () => {
    auth.signOut()
    dispatch({
      type: "LOGOUT",
    })
    navigate('/candidate/auth')
  }
  return (
    <div>
      <button
      onClick={logout}
      >Logout</button>
    <div>candidate Onboarding</div>
    </div>
  )
}

export default CandidateOnboarding