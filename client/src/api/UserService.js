import API from "./apiConfig";
import { urls } from "./config";

const getUserDetails = () => {
  return API(
    {
      method: "GET",
      url: urls.user.get_user_details,
    },
    true
  );
};
const login = ({ data }) => {
  return API(
    {
      method: "POST",
      url: urls.user.login,
      data,
    },
    false
  );
};
const register = ({ data }) => {
  return API(
    {
      method: "POST",
      url: urls.user.register,
      data,
    },
    false
  );
};

export const UserService = { login, register, getUserDetails };
