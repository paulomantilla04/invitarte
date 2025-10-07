import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import logo from '@/assets/logo.svg';
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { UserAuth } from "@/context/AuthContext";
import { motion } from "motion/react";

export default function LoginForm() {
    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const navigate = useNavigate();
    const { signIn } = UserAuth();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn(email, password);
            if (result.success) {
                navigate("/dashboard");

            } else if (result.error) {
                setError("Error al iniciar sesión: " + result.error.message);
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: "easeInOut", duration: 0.1 }}>
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="space-y-6">
                <motion.div className="mx-auto w-full max-w-[120px] pt-4" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: "easeInOut", duration: 0.2 }}>
                    <div className="">
                        <img src={logo} alt="InvitARTE Logo" className="rounded-md object-contain"/>
                    </div>
                </motion.div>

                <motion.div className="space-y-2 text-center" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: "easeInOut", duration: 0.3 }}>
                    <CardTitle className="text-2xl font-bold font-montserrat">Bienvenid@ de vuelta</CardTitle>
                    <CardDescription className="font-montserrat">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
                </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
                <motion.div className="space-y-2 font-roboto" initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ ease: "easeInOut", duration: 0.4 }}>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="nombre@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </motion.div>
                <motion.div className="space-y-2 font-roboto" initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ ease: "easeInOut", duration: 0.5 }}>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Contraseña</Label>
                    </div>
                    <div className="relative">
                        <Input id="password" type={showPassword ? "text" : "password"}
                        placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <Button
                            type="button"
                            variant="ghost"
                            size={"icon"}
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                        </Button>
                    </div>
                </motion.div>
            </CardContent>
            <CardFooter>
                <motion.span className="w-full" initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ ease: "easeInOut", duration: 0.6 }}>
                    <Button className="w-full cursor-pointer font-montserrat" onClick={handleSubmit} disabled={loading}>
                        <LogIn className="mr-2 h-4 w-4" />
                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                    <p className="text-sm font-montserrat mt-4">¿No tienes una cuenta? <a href="/register" className="text-blue-500">Regístrate</a></p>
                    {error && <p className="text-red-500 text-sm mt-4 bg-red-100 p-2 rounded-lg font-montserrat text-center">{error}</p>}
                </motion.span>
            </CardFooter>
        </Card>
        </motion.div>
    )
}