/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */
/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
    message: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        email: string;
        name: string;
    };
}
export interface UserInfo {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    plan: string;
    status: string;
}
