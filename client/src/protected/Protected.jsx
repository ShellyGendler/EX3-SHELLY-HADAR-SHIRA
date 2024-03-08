import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Protected = ({ children }) => {
  const [accessible, setAccessible] = useState(null);

  // check if the user is authenticated or not
  useEffect(() => {
    if (localStorage.getItem("authenticated")) {
      setAccessible(true);
    }
    else {setAccessible(false);}  
  }, []);


  switch (accessible) {
    case true:
      return children;
    case false:
      return <Navigate to="/login" />;
    case null:
      return <div className="expand-centered">Loading...</div>;
  }
};
export default Protected;