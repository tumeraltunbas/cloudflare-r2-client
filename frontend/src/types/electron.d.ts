interface Credentials {
	accountId: string;
	apiKey: string;
}

interface Window {
	api: {
		hasCredentials: () => Promise<boolean>;
		saveCredentials: (credentials: Credentials) => Promise<boolean>;
	};
}
