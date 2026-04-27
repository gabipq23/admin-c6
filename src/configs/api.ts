import axios from "axios";

export const apiPurchase = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3720",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// const attachAuthToken = (config: any) => {
//   const localStorageService = new LocalStorageService();
//   const token = localStorageService.getItem(LocalStorageKeys.accessToken);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// };

const forceLogoutAndRedirect = () => {
  // const localStorageService = new LocalStorageService();
  // localStorageService.removeItem(LocalStorageKeys.accessToken);
  // localStorageService.removeItem(LocalStorageKeys.user);

  localStorage.removeItem("c6@user");

  if (window.location.pathname !== "/admin") {
    window.location.replace("/admin");
  }
};

// apiPurchase.interceptors.request.use(attachAuthToken);
apiPurchase.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? "");
    const isLoginRequest = requestUrl.includes("/c6/auth/login");

    if (status === 401 && !isLoginRequest) {
      forceLogoutAndRedirect();
    }

    return Promise.reject(error);
  },
);

// Tools
export const apiAvailability = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3620",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiBase2b = axios.create({
  baseURL: "https://base2b.online:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiCheckOperadora = axios.create({
  baseURL: "https://zapchecker.bigdates.com.br/api/public",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "sMVD95wfLe3WDLP5b3DQfBNjzdb8dZ",
  },
});

// Chat
export const apiUberich = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3300",
  headers: {
    "Content-Type": "application/json",
    "x-flowise-token":
      "ff52c550a19a84ce0de929b75874ef8bbd503eeffdaeb324cdb7da0c7f4cd819cfb760c07b0e2578197fc3934c13df24",
  },
});

export const apiEvolution = axios.create({
  baseURL: "https://evolution.bigdates.com.br:3000/evolution/relay",
  headers: {
    "Content-Type": "application/json",
    "x-flowise-token":
      "ff52c550a19a84ce0de929b75874ef8bbd503eeffdaeb324cdb7da0c7f4cd819cfb760c07b0e2578197fc3934c13df24",
  },
});
