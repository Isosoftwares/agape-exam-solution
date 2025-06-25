import { toast } from "react-toastify";
import axios from "../api/axios";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const userId = JSON.parse(localStorage.getItem("userId"));

  const logout = useLogout();

  const refresh = async () => {
    const response = await axios.get(`auth/refresh/${userId}`, {
      withCredentials: true,
    });

    if (response?.data?.message === "Unauthorized") {
      toast.info("Your session expired")
      await logout();

      return 0;
    }

    setAuth((prev) => {
      return {
        ...prev,
        roles: response?.data?.roles,
        accessToken: response?.data?.accessToken,
        userName: response?.data?.email?.split('@')[0]|| "",
        userId: response?.data?.user_Id,
        imgUrl: response?.data?.imgUrl,
        isEmailVerified: response?.data?.isEmailVerified,
        permissions: response?.data?.permissions,
        balance: response?.data?.balance,
        subscription: response?.data?.subscription,
      };
    });
    return response?.data?.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
