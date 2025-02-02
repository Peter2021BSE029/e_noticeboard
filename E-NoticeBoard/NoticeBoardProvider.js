import React, { createContext, useContext, useState } from 'react';

const NoticeBoardContext = createContext();

export const NoticeBoardProvider = ({ children }) => {
  const [notices, setNotices] = useState([]);

  const addNotice = (newNotice) => {
    setNotices(prevNotices => [...prevNotices, newNotice]);
  };

  const removeNotice = (id) => {
    setNotices(prevNotices => prevNotices.filter(notice => notice.id !== id));
  };

  const editNotice = (id, updatedNotice) => {
    setNotices(prevNotices => 
      prevNotices.map(notice => (notice.id === id ? updatedNotice : notice))
    );
  };

  return (
    <NoticeBoardContext.Provider value={{ notices, addNotice, removeNotice, editNotice }}>
      {children}
    </NoticeBoardContext.Provider>
  );
};

export const useNoticeBoard = () => useContext(NoticeBoardContext);
