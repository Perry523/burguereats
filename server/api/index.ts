import axios from "axios";
import { useLoginStore } from "~/stores/user";

export const api = axios.create({
  // baseURL: runtimeConfig.public.API_URL,
  // baseURL: "http://localhost:3333",
});
api.interceptors.request.use((config) => {
  const runtimeConfig = useRuntimeConfig();
  config.baseURL = runtimeConfig.public.API_URL + "/api";
  const loginStore = useLoginStore();
  const token = loginStore.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response?.status === 403) {
      useLoginStore().logout();
    }
    return Promise.reject(error);
  }
);

export function getServices(url: string) {
  async function create(endpointOrData: unknown, reqData?: object) {
    try {
      let postData;
      // checks if the endpointOrData is a string or a object to be posted as data
      if (typeof endpointOrData === "string") {
        postData = reqData || {};
      } else {
        postData = endpointOrData;
      }

      const response = await api.post(
        typeof endpointOrData === "string" ? endpointOrData : url,
        postData
      );
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function deleteById(id: string) {
    try {
      const response = await api.delete(`${url}/${id}`);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function edit(data: object) {
    try {
      // eslint-disable-next-line
      // @ts-ignore
      const response = await api.put(`${url}/${data.id}`, data);
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function getAll(reqURL?: string) {
    // const drawerStore = useDrawer();
    try {
      const response = await api.get(reqURL ?? url, {
        // params: {
        //   game: drawerStore.selectedGame,
        // },
      });
      return response.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return { create, getAll, edit, deleteById, api };
}
