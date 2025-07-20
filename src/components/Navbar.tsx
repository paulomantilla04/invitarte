import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useMobile } from "@/hooks/use-mobile";
import logo from '@/assets/logo.svg';
import { UserAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import InvitationDialog from "./InvitationDialog";

export const Navbar = () => {
    const isMobile = useMobile();
    const { signOut } = UserAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/login");
    }

    return (
        <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex-items-center">
                <div className="flex-items-center gap-2">
                    <div className="relative">
                        <img
                            src={logo}
                            alt="Logo"
                            width={100}
                            height={100}
                            className="rounded-md object-contain"
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <InvitationDialog />
                <Button variant="default" size={isMobile ? "icon" : "default"} className="cursor-pointer" onClick={handleSignOut}>
                    <LogOut className="h-5 w-5" />
                    {!isMobile && <span className="ml-2">Cerrar sesión</span>}
                    {isMobile && <span className="sr-only">Cerrar sesión</span>}
                </Button>
            </div>
        </nav>
    )
}