import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/auth.store";
import { parseApiResponse } from "../lib/api-parser";
import { refreshSchema } from "../modules/auth/schemas/refresh.schema";

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
})

http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
)


let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];
const resolveQueue = (token: string) => {
    pendingRequests.forEach((callback) => callback(token));
    pendingRequests = [];
};

const NO_REFRESH_URLS = ["auth/login", "auth/refresh"];

http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;
        const isNoRefresh = NO_REFRESH_URLS.some((url) =>
            originalRequest.url?.includes(url)
        );
        if (error.response?.status === 401 && !originalRequest._retry && !isNoRefresh) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve) => {
                    pendingRequests.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(http(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const dataRes = parseApiResponse(refreshSchema, res.data);
                const accessToken = dataRes.data?.accessToken!;
                useAuthStore.getState().setAccessToken(accessToken);
                resolveQueue(accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return http(originalRequest);
            } catch (err) {
                useAuthStore.getState().clear();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default http;