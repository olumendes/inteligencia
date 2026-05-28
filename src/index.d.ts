interface Env {
    PING_MESSAGE?: string;
    RESEND_API_KEY: string;
    GMAIL_USER?: string;
    GMAIL_APP_PASSWORD?: string;
}
declare const _default: {
    fetch: (request: Request, env: Env, ctx: ExecutionContext) => Response | Promise<Response>;
};
export default _default;
