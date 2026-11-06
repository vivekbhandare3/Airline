import axios from "axios";

/**
 * CSRF protection for the Spring Security backend (cookie-based token, same as BidSphere).
 *
 * 1. The backend sets an XSRF-TOKEN cookie when GET /api/csrf is called.
 * 2. axios copies that cookie into the X-XSRF-TOKEN header on every request
 *    (withXSRFToken: true also sends it cross-origin: localhost:5173 -> localhost:8080).
 * 3. The interceptor below makes sure the cookie exists BEFORE any POST/PUT/PATCH/DELETE,
 *    so login, register, booking, payment and admin calls never fail with 403.
 */
const API = "http://localhost:8080";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

const UNSAFE_METHODS = ["post", "put", "patch", "delete"];

const hasCsrfCookie = () =>
    document.cookie.split(";").some((c) => c.trim().startsWith("XSRF-TOKEN="));

let pendingRequest = null;

export const ensureCsrfToken = () => {
    if (hasCsrfCookie()) {
        return Promise.resolve();
    }

    // Several requests can start at once: share one /api/csrf call.
    if (!pendingRequest) {
        pendingRequest = axios
            .get(`${API}/api/csrf`)
            .finally(() => {
                pendingRequest = null;
            });
    }

    return pendingRequest;
};

axios.interceptors.request.use(async (config) => {
    const method = (config.method || "get").toLowerCase();

    if (UNSAFE_METHODS.includes(method)) {
        await ensureCsrfToken();
    }

    return config;
});
