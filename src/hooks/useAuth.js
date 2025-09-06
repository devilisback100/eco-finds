import { useAuth } from "../contexts/AuthContext";

export default function useAuthHook() {
    const { user, login, logout, signup } = useAuth();
    return { user, login, logout, signup };
}
