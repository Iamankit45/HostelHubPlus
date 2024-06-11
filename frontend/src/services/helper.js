// export const BASE_URL = 'http://localhost:4000'
export const BASE_URL = 'https://hostelhubplus.onrender.com'


export const isHostelAdmin = (user) => {
    return user && user.role === 'hostel-admin';
  };