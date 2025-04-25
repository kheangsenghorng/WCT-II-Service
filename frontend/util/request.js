// util/request.js
import axios from "axios";
import config from "./config";
import { useAuthStore } from "@/store/authStore";

export const request = (url = "", method = "", data = {}) => {
  const { token } = useAuthStore.getState();
  console.log("Auth Token:", token);

  return axios({
    url: `${config.base_url}${url}`,
    method,
    data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error("API request error:", error);
      throw error;
    });
};
