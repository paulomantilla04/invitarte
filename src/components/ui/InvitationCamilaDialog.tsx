import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/config/supabaseClient'
import { Check } from 'lucide-react'
import Counter from "../reactbits/Counter"
import { toast } from "sonner"

interface Guest {
    name: string;
    confirmed: true | false | null;
    guests: number | null;
}

const InvitationCamilaDialog = () => {

    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [counter, setCounter] = useState<number>(0);

    const incrementCounter = () => {
        if (counter < 10) {
            setCounter(counter + 1);
        }
    }

    const decrementCounter = () => {
        if (counter > 0) {
            setCounter(counter - 1);
        }
    }

    const resetForm = () => {
        setName("");
        setCounter(0);
        setError(null);
        setIsOpen(false);
    }

    const handleSubmit = async () => {
        if (!name) {
            setError("Por favor, ingresa tu nombre y apellido");
            toast.error(error || "Por favor, ingresa tu nombre y apellido", {
                duration: 1500,
                position: "top-center",
                style: {
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontSize: "16px",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                }
              });
              
            return;
        }

        setLoading(true);

        const guest: Guest = {
            name,
            confirmed: true,
            guests: counter,
        }

        try {
            const { data, error } = await supabase
                .from("guests-camila")
                .insert([guest])
                .select();

                if (error) throw error;

                if (data) {
                    toast.success("Asistencia confirmada correctamente", {
                        duration: 1500,
                        position: "top-center",
                        style: {
                            background: "rgba(255, 255, 255, 0.1)",
                            color: "#ffffff",
                            borderRadius: "12px",
                            padding: "12px 16px",
                            fontSize: "16px",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                          }
                    });
                }

                setTimeout(resetForm, 1000);

        } catch (error) {
            setError("Error al confirmar la asistencia");
            console.error("Error al confirmar la asistencia:", error);
        } finally {
            setLoading(false);
        }
    }

    
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="flex-1 h-12 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-200 rounded-2xl shadow-lg font-montserrat hover:text-white cursor-pointer"
                    variant="ghost"
                >
                    <Check className="w-5 h-5 mr-2" />
                    Confirmar asistencia
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/25 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg font-montserrat" aria-describedby="asistencia-dialog-description">
                <DialogHeader className="flex flex-col items-start gap-2" aria-describedby="asistencia-dialog-description">
                    <DialogTitle className="text-white">Confirmar asistencia</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-start gap-2 mb-4 mt-4">
                    <Label htmlFor="name" className="text-white">Nombre y apellido</Label>
                    <Input id="name" type="text" className="w-full mt-1 bg-white/10 border-white/20 text-white" value={name} onChange={(e) => setName(e.target.value)}/>
                    
                    <Label htmlFor="guests" className="text-white">Número de acompañantes</Label>

                    <div className="flex items-center gap-2 mt-2">
                        <Button size="icon" onClick={decrementCounter} className="bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 rounded-full cursor-pointer shadow-lg">
                            <Minus className="w-5 h-5" /> 
                        </Button>
                        <Counter
                            value={counter}
                            places={[10, 1]}
                            fontSize={50}
                            padding={5}
                            gap={10}
                            textColor="white"
                            topGradientStyle={{
                                background: "linear-gradient(to bottom, #000000, #00000000)"
                            }}
                            bottomGradientStyle={{
                                background: "linear-gradient(to top, #000000, #00000000)"
                            }}
                        />
                       <Button size="icon" onClick={incrementCounter} className="bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 rounded-full cursor-pointer shadow-lg">
                            <Plus className="w-5 h-5" /> 
                        </Button>
                    </div>
                    
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="mr-2 cursor-pointer bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 rounded-2xl shadow-lg font-montserrat">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button className="cursor-pointer bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 rounded-2xl shadow-lg font-montserrat" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Confirmando..." : "Confirmar asistencia"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export default InvitationCamilaDialog;