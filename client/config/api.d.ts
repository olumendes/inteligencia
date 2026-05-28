export declare const apiClient: {
    get: (endpoint: string) => Promise<unknown>;
    post: (endpoint: string, data: unknown) => Promise<unknown>;
};
export declare const API_ENDPOINTS: {
    readonly PING: "/api/ping";
    readonly DEMO: "/api/demo";
    readonly CONTACT: "/api/contact";
    readonly TRIAL_SIGNUP: "/api/trial-signup";
};
