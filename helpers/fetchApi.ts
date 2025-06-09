import axios, { AxiosRequestConfig } from "axios";
import { getUserToken } from "@/lib/authentication/getUserToken";
/**
 * Fetches data from a given API endpoint using Axios.
 *
 * @param {string} url - The API endpoint to fetch data from.
 * @param {AxiosRequestConfig} [options] - Optional Axios request configuration.
 * @returns {Promise<any>} - A promise that resolves to the response data.
 */
export async function fetchApi(
    url: string,
    options: AxiosRequestConfig = {}
): Promise<any> {
    try {
        const token = await getUserToken();

        const response = await axios({
            url,
            method: options.method || "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`,
                ...(options.headers || {}),
            },
            data: options.data,
            params: options.params,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching API:", error);
        throw error;
    }
}