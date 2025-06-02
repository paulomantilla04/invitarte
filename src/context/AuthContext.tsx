import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "@/config/supabaseClient";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
    session: Session | null;
    signIn: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    signOut: () => Promise<{ success: boolean; error?: any }>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const signIn = async (email: string, password: string) => {

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error("Hubo un problema al iniciar sesion", error);
            return {
                success: false,
                error: {
                    message: error.message === "Invalid login credentials"
                        ? "Correo electrónico o contraseña incorrectos"
                        : "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
                }
            };
        }

        console.log("Inicio de sesión exitoso", data);

        return { success: true, data };
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("hubo un problema al cerrar sesión", error);
            return { success: false, error };
        }
        return { success: true };
    }


    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("UserAuth must be used within an AuthProvider");
    }
    return context;
}