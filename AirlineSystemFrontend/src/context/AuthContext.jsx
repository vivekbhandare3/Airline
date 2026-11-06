
import React, {
    createContext,
    useState,
    useEffect
} from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = "http://localhost:8080";

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Update authentication state
    const setAuthenticatedUser = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Normal user login
    const login = async (credentials) => {

        const response = await axios.post(
            `${API_URL}/authenticate`,
            credentials,
            {
                withCredentials: true
            }
        );

        const userData = response.data.user || response.data;

        setAuthenticatedUser(userData);

        return response.data;
    };

    // Check authentication when application starts
    useEffect(() => {

        const checkAuthStatus = async () => {

            try {

                // First check admin authentication
                try {

                    const adminResponse = await axios.get(
                        `${API_URL}/admin/profile`,
                        {
                            withCredentials: true
                        }
                    );

                    setAuthenticatedUser({
                        ...adminResponse.data,
                        accountType: "ADMIN"
                    });

                    return;

                } catch (adminError) {
                    // Admin authentication failed.
                    // Now check normal user authentication.
                }

                // Check normal user authentication
                const userResponse = await axios.get(
                    `${API_URL}/user/profile`,
                    {
                        withCredentials: true
                    }
                );

                setAuthenticatedUser(userResponse.data.user);

            } catch (error) {

                setUser(null);
                setIsAuthenticated(false);

            } finally {

                setLoading(false);

            }
        };

        checkAuthStatus();

    }, []);

    // Logout
    
const logout = async () => {

    try {

        // Call backend to delete the HttpOnly JWT cookie
        await axios.post(
            `${API_URL}/logout`,
            {},
            {
                withCredentials: true
            }
        );

    } catch (error) {

        console.error("Backend logout failed:", error);

    } finally {

        // Clear React authentication state
        setUser(null);
        setIsAuthenticated(false);

        // Redirect to login page
        window.location.href = "/login";
    }
};


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                setIsAuthenticated,
                loading,
                login,
                setAuthenticatedUser,
                logout
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
