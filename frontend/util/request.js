// // util/request.js
// import axios from "axios";
// import config from "./config";
// import { useAuthStore } from "@/store/authStore";

// export const request = (url = "", method = "", data = {}) => {
//   const { token } = useAuthStore.getState();
//   // console.log("Auth Token:", token);

//   return axios({
//     url: `${config.base_url}${url}`,
//     method,
//     data,
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + token,
//     },
//   })
//     .then((response) => response.data)
//     .catch((error) => {
//       console.error("API request error:", error);
//       throw error;
//     });
// };

// // util/request.js
// import axios from "axios";
// import config from "./config";
// import { useAuthStore } from "@/store/authStore";

// export const request = (url = "", method = "", data = {}, customConfig = {}) => {
//   const { token } = useAuthStore.getState();
//   const isFormData = data instanceof FormData;

//   console.log(token);

//   return axios({
//     url: `${config.base_url}${url}`,
//     method,
//     data,
//     headers: {
//       Accept: "application/json",
//       ...(isFormData ? {} : { "Content-Type": "application/json" }), // Let Axios handle FormData headers
//       Authorization: `Bearer ${token}`,
//       ...customConfig.headers,
//     },
//     ...customConfig,
//   })
//     .then((response) => response.data)
//     .catch((error) => {
//       console.error("API request error:", error);
//       throw error;
//     });
// };

// util/request.js
import axios from "axios";
import config from "./config";
import { useAuthStore } from "@/store/authStore";

export const request = (
  url = "",
  method = "",
  data = {},
  customConfig = {}
) => {
  const token = useAuthStore.getState().getToken?.(); // safely call getToken()

  const isFormData = data instanceof FormData;

  return axios({
    url: `${config.base_url}${url}`,
    method,
    data,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customConfig.headers,
    },
    ...customConfig,
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error("API request error:", error);
      throw error;
    });
};
