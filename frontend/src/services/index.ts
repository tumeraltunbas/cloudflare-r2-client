export const fetcher = async (endpoint: string, options?: RequestInit) => {
	const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
	const url = API_BASE_URL + endpoint;
	return await fetch(url, options);
};
