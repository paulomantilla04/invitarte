import { useMobile } from '@/hooks/use-mobile'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { PlusCircle } from 'lucide-react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useState } from 'react'
import { supabase } from '@/config/supabaseClient'
import { motion } from 'motion/react'

interface Guest {
    name: string;
    confirmed: boolean | null;
    guests: number | null;
}

const InvitationDialog = () => {
    const isMobile = useMobile();

    const [name, setName] = useState<string>("");

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const resetForm = () => {
        setName("");
        setError(null);
        setSuccess(false);
        setIsOpen(false);
    }


    const validateForm = (): boolean => {

        if (!name) {
            setError("El nombre y apellido son obligatorios");
            return false;
        }

        if (name.length < 3) {
            setError("El nombre y apellido deben tener al menos 3 caracteres");
            return false;
        }

        return true;
    }
 
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        const guest: Guest = {
            name,
            confirmed: null,
            guests: null,
        }

        try {
            const { data, error } = await supabase
                .from("guests")
                .insert([guest])
                .select();

                if (error) throw error;

                if (data) {
                    setSuccess(true);
                }

                setTimeout(resetForm, 1000);

        } catch (error) {
            setError("Error al crear la invitación");
            console.error("Error creating guest:", error);
        } finally {
            setLoading(false);
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant="ghost" size={isMobile ? "icon" : "default"} className="cursor-pointer">
                <PlusCircle className="h-5 w-5" />
                {!isMobile && <span className="ml-2">Crear invitación</span>}
                {isMobile && <span className="sr-only">Crear invitación</span>}
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader className='flex flex-col items-start'>
                <DialogTitle>Crea una invitación</DialogTitle>
                <DialogDescription>Solo escribe el nombre y apellido del invitado.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-start gap-2 mb-4 mt-4">
                <Label htmlFor='name'>Nombre y apellido</Label>
                <Input id="name" type="text" className="w-full mt-2" value={name} onChange={(e) => setName(e.target.value)}/>

                { error && (
                    <motion.div className="w-full p-2 bg-red-100 text-red-700 rounded text-sm font-montserrat mt-2" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: "easeInOut", duration: 0.3 }}>
                        {error}
                    </motion.div>
                )}

                { success && (
                    <motion.div className="w-full p-2 bg-green-100 text-green-700 rounded text-sm font-montserrat mt-2" initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: "easeInOut", duration: 0.3 }}>
                        Invitación creada con éxito.
                    </motion.div>
                )}
            </div>
            <DialogFooter className='justify-end'>
                <DialogClose asChild>
                    <Button variant="outline" className="mr-2 cursor-pointer">
                        Cancelar
                    </Button>
                </DialogClose>
                <Button type="submit" className="cursor-pointer" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Creando..." : "Crear invitación"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog> 
  )
}

export default InvitationDialog