// NoticeContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { BASE_URL } from "../services/helper";

const API = `${BASE_URL}/api/v1/notice`;

export const NoticeContext = createContext();

export const useNoticeContext = () => {
  return useContext(NoticeContext);
};

export const NoticeProvider = ({ children }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(API); // Adjust the endpoint as per your backend setup
        if (!response.ok) {
          throw new Error('Failed to fetch notices');
        }
        const data = await response.json();
        setNotices(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notices:', error);
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <NoticeContext.Provider value={{ notices, loading }}>
      {children}
    </NoticeContext.Provider>
  );
};
