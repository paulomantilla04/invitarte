import { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import logo from '@/assets/logo.svg';
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { UserAuth } from "@/context/AuthContext";
import { motion } from "motion/react";

export default function RegisterForm() {
    const [displayName, setDisplayName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { signUp } = UserAuth();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // Validaciones
        if (!displayName || !email || !password || !confirmPassword) {
            setError("Por favor, completa todos los campos");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            const result = await signUp(email, password, displayName);
            if (result.success) {
                navigate("/dashboard");
            } else if (result.error) {
                setError("Error al registrarse: " + result.error.message);
            }
        } catch (error) {
            console.error("Error al registrarse:", error);
            setError("Error al registrarse. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <motion.div 
            className="w-full max-w-md" 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ ease: "easeInOut", duration: 0.1 }}
        >
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-6">
                    <motion.div 
                        className="mx-auto w-full max-w-[120px] pt-4" 
                        initial={{ opacity: 0, y: 25 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ ease: "easeInOut", duration: 0.2 }}
                    >
                        <div className="">
                            <img src={logo} alt="InvitARTE Logo" className="rounded-md object-contain"/>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="space-y-2 text-center" 
                        initial={{ opacity: 0, y: -25 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ ease: "easeInOut", duration: 0.3 }}
                    >
                        <CardTitle className="text-2xl font-bold font-montserrat">Crear cuenta</CardTitle>
                        <CardDescription className="font-montserrat">
                            Ingresa tus datos para registrarte
                        </CardDescription>
                    </motion.div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <motion.div 
                        className="space-y-2 font-roboto" 
                        initial={{ opacity: 0, x: 25 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ ease: "easeInOut", duration: 0.4 }}
                    >
                    <Label htmlFor="displayName">Nombre</Label>
                        <Input 
                            id="displayName" 
                            type="text" 
                            placeholder="Juan Pérez" 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </motion.div>
                    <motion.div 
                        className="space-y-2 font-roboto" 
                        initial={{ opacity: 0, x: -25 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ ease: "easeInOut", duration: 0.45 }}
                    >
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="nombre@ejemplo.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </motion.div>
                    <motion.div 
                        className="space-y-2 font-roboto" 
                        initial={{ opacity: 0, x: 25 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ ease: "easeInOut", duration: 0.5 }}
                    >
                        <Label htmlFor="password">Contraseña</Label>
                        <div className="relative">
                            <Input 
                                id="password" 
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size={"icon"}
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="space-y-2 font-roboto" 
                        initial={{ opacity: 0, x: 25 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ ease: "easeInOut", duration: 0.6 }}
                    >
                        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                        <div className="relative">
                            <Input 
                                id="confirmPassword" 
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size={"icon"}
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                onClick={toggleConfirmPasswordVisibility}
                                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </CardContent>
                <CardFooter>
                    <motion.span 
                        className="w-full" 
                        initial={{ opacity: 0, x: -25 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ ease: "easeInOut", duration: 0.7 }}
                    >
                        <Button 
                            className="w-full cursor-pointer font-montserrat" 
                            onClick={handleSubmit} 
                            disabled={loading}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {loading ? "Registrando..." : "Registrarse"}
                        </Button>

                        <p className="text-sm font-montserrat mt-4">¿Ya tienes una cuenta? <a href="/login" className="text-blue-500">Inicia sesión</a></p>
                        
                        {error && (
                            <p className="text-red-500 text-sm mt-4 bg-red-100 p-2 rounded-lg font-montserrat text-center">
                                {error}
                            </p>
                        )}
                    </motion.span>
                </CardFooter>
            </Card>
        </motion.div>
    );
}