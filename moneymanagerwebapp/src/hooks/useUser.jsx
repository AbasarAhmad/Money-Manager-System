import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../Util/axiosConfig";
import { API_ENDPOINTS } from "../Util/apiEndpoints";
import { AppContext } from "../context/AppContext";

const useUser = () => {
  const { user, setUser, clearUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If user already loaded, do nothing
    if (user) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);

        if (isMounted && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info", error);
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUserInfo(); // call function properly

    return () => {
      isMounted = false;
    };
  }, [user, setUser, clearUser, navigate]);

  return user;
};

export default useUser;
