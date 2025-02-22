"use client";
import React, { createContext, useState, useContext } from 'react';


// Create the UserContext without TypeScript types
const UserContext = createContext({
  contextemail: '',
  contextId: '',
  contextinput: '',
  contextname: '',
  contextpassword: '',
  contextisLoggedIn: false,
  contextQRInfo: '',
  contextSelectedPerson: '',
  contextimg: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',

  contextsetEmail: () => {},
  contextsetId: () => {},
  contextsetinput: () => {},
  contextsetName: () => {},
  contextsetPassword: () => {},
  contextsetIsLoggedIn: () => {},
  contextsetQRInfo: () => {},
  contextsetimg: () => {},
  contextSetSelectedPerson: () => {},

});

export const UserProvider = ({ children }) => {
  const [contextemail, contextsetEmail] = useState('');
  const [contextId, contextsetId] = useState('');
  const [contextinput, contextsetinput] = useState('');
  const [contextname, contextsetName] = useState('');
  const [contextpassword, contextsetPassword] = useState('');
  const [contextQRInfo, contextsetQRInfo] = useState('');
  const [contextSelectedPerson, contextSetSelectedPerson] = useState('');
  const [contextisLoggedIn, contextsetIsLoggedIn] = useState(false);
  const [contextimg, contextsetimg] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
  
  const value = {
    contextemail,
    contextId,
    contextsetId,
    contextinput,
    contextname,
    contextpassword,
    contextisLoggedIn,
    contextimg,
    contextsetEmail,
    contextsetName,
    contextsetPassword,
    contextsetIsLoggedIn,
    contextsetimg,
    contextQRInfo,
    contextsetQRInfo,
    contextSelectedPerson,
    contextSetSelectedPerson,
    contextsetinput
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};