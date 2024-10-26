import React, { createContext, useEffect, useState } from 'react'
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from "../firebase/firebase.config"
import axios from 'axios';

export const AuthContext = createContext();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
 
const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading]= useState(true);

    //creste an account
    const createUser = (email, password)=>{
      setLoading(true);
      return createUserWithEmailAndPassword(auth, email, password)
    }

    // signup  with gmail
    const signUpWithGmail = () => {
      return signInWithPopup(auth, provider)
    }
 
    //login using email password
    const login = (email,password) =>{
      return signInWithEmailAndPassword(auth, email, password)
    }

    //logout
    const logout = () =>{
      return signOut(auth) 
    }
    
    //update profile
    const updateUserProfile = (name,photoURL) =>{
      return updateProfile(auth.currentUser, {
        displayName: name, 
        photoURL: photoURL
      })
    }

    //check signed in user
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          //setUser(currentUser);  // Set the user state to the current user
          const userInfo = { email: currentUser.email };
    
          // Make sure axios.post is correctly structured
          axios.post('http://localhost:6001/jwt', userInfo)
            .then(function (response) {
              //console.log(response.data.token);  // Handle the response from the server
              if(response.data.token){
                localStorage.setItem("access-token",response.data.token)
              }
            })
            .catch(function (error) {
              console.error("Error during token fetch: ", error);  // Handle errors
            });
    
          setLoading(false);
        } 
        else {
          setUser(null);  // Set the user state to null if the user is not authenticated
          localStorage.removeItem("access-Token")
        }
        setLoading(false);
      });
    
      // Cleanup function to unsubscribe from the auth state listener
      return () => unsubscribe();
    }, []);
    


    const authInfo = {
        user,
        createUser,
        signUpWithGmail,
        login,
        logout,
        updateUserProfile,
        loading
    }
  return (
    <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
