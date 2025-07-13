import { useState, useRef, useEffect } from "react";
import { Calendar, Clock, MapPin, Church, PartyPopper } from "lucide-react";
import { Button } from "./ui/button";
import { CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Textarea } from "./ui/textarea";
import { supabase } from '@/config/supabaseClient';
import { useParams } from 'react-router';
import { toast } from 'sonner';

interface Guest {
    name: string | null;
    guests: number | null;
    confirmed: boolean;
    dietaryRestrictions: string | null;
    specialRequests: string | null;
    maxGuests: number;
}

const formSchema = z.object({
    name: z.string().optional(),
    attendance: z.enum(["yes", "no"], {
        required_error: "Por favor, selecciona una opción",
    }),
    // guests min 1, max 5
    guests: z.coerce.number().min(1, "Debe ser al menos 1 persona"),
    dietaryRestrictions: z.string().optional(),
    specialRequests: z.string().optional(),
});

export default function InvitationModal() {
    const [isOpen, setIsOpen] = useState(false);

    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [guest, setGuest] = useState<Guest | null>(null);
    const [loadingConfirmation, setLoadingConfirmation] = useState<boolean>(false);
    const [loadingCancelation, setLoadingCancelation] = useState<boolean>(false);

    const maxGuestsNumber = guest?.maxGuests || 0;


    const resetForm = () => {
        setIsOpen(false);
        setError(null);
        form.reset();
    }

    
    useEffect(() => {

        if (!id) return;

        const fetchGuest = async () => {
        try {
            const { data: guestData, error } = await supabase
                .from("guests")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            if (guestData) {
                setGuest(guestData as Guest);

            }
        } catch (error) {
            console.error("Error fetching guest:", error);
            setError("Error al cargar la invitación");
        } finally{
            setLoading(false);
        }
    }

        fetchGuest();
    }, [id]);

    const modalRef = useRef<HTMLDivElement>(null);
    
    const modalInView = useInView(modalRef, {
        once: true,
    });

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3, // Delay entre cada hijo
                delayChildren: 0.1
            }
        }
    };

    const staggerItem = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const staggerItemXPositive = {
        hidden: { opacity: 0, x: 30 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    const staggerItemXNegative = {
        hidden: { opacity: 0, x: -30 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            attendance: undefined,
            guests: 1,
            dietaryRestrictions: "",
            specialRequests: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (values.attendance === "yes") {
            setLoadingConfirmation(true);

            const guestData: Guest = {
                name: guest?.name || null,
                guests: Number(values.guests)|| 1,
                confirmed: true,
                dietaryRestrictions: values.dietaryRestrictions || null,
                specialRequests: values.specialRequests || null,
                maxGuests: guest?.maxGuests || 0,
            }

            try {
                const { data, error } = await supabase
                    .from("guests")
                    .update([guestData])
                    .eq("id", id)
                    .select();
                
                if (error) throw error;

                if (data) {
                    setTimeout(resetForm, 1000);
                    toast.success("Asistencia confirmada");
                }
            } catch (error) {
                console.error("Error confirming:", error);
                toast.error("Error al confirmar asistencia");
            } finally {
                setLoadingConfirmation(false);
            }
        } else {
            setLoadingCancelation(true);

            const guestData: Guest = {
                name: guest?.name || null,
                guests: null,
                confirmed: false,
                dietaryRestrictions: null,
                specialRequests: null,
                maxGuests: guest?.maxGuests || 0,
            }

            try {
                const { data, error } = await supabase
                    .from("guests")
                    .update([guestData])
                    .eq("id", id)
                    .select();

                if (error) throw error;

                if (data) {
                    setTimeout(resetForm, 1000);
                    toast.error("Asistencia cancelada");
                }      
            } catch (error) {
                console.error("Error canceling:", error);
                toast.error("Error al cancelar asistencia");
            } finally {
                setLoadingCancelation(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="overflow-hidden w-full max-w-4xl bg-white shadow-xl transition-all rounded-lg ">
                <motion.div className="grid lg:grid-cols-2 gap-0" ref={modalRef} variants={staggerContainer} initial="hidden" animate={modalInView ? "visible" : "hidden"}>
                    {/* Image Section */}
                    <div className="relative h-64 lg:h-full w-full overflow-hidden ">
                        <img
                            src="https://i.pinimg.com/736x/05/45/04/054504e4faceeb61c885dcb08e15e317.jpg"
                            alt="Wedding Venue"
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-6"></div>
                    </div>

                    <CardContent className="p-6 lg:p-8 flex flex-col justify-between">
                        <div className="space-y-6">
                            <motion.div className="text-center" variants={staggerItem}>
                                <h2 className="text-3xl font-inria font-bold tracking-tight text-gray-900">Estás invitad@</h2>
                                <p className="mt-2 text-gray-600 font-montserrat">Ven a celebrar con nosotros nuestra boda</p>
                                <div className="mt-4 h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
                            </motion.div>

                            {/* Ceremony Details */}
                            <motion.div className="space-y-4 font-montserrat" variants={staggerItemXPositive}>
                                <div className="flex items-center gap-2 text-black">
                                <Church className="h-5 w-5" />
                                <h3 className="font-semibold text-lg">Ceremonia</h3>
                                </div>

                                <div className="ml-7 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-500 mt-1" />
                                    <div>
                                    <p className="font-medium text-gray-900">31 de agosto de 2025</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-gray-500 mt-1" />
                                    <div>
                                    <p className="font-medium text-gray-900">1:00 PM</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                    <div>
                                        <a href="https://maps.app.goo.gl/RVzYBqnmGL9crw3aA" target="_blank" className="bg-transparent text-gray-900 font-medium cursor-pointer location-button">Catedral de Tula</a>
                                    </div>
                                </div>
                                </div>
                            </motion.div>

                            {/* Reception Details */}
                            <motion.div className="space-y-4 font-montserrat" variants={staggerItemXNegative}>
                                <div className="flex items-center gap-2 text-black">
                                    <PartyPopper className="h-5 w-5" />
                                    <h3 className="font-semibold text-lg">Recepción</h3>
                                </div>

                                <div className="ml-7 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-4 w-4 text-gray-500 mt-1" />
                                        <div>
                                            <p className="font-medium text-gray-900 text-start ">3:00 PM</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                        <div>
                                            <a href="https://maps.app.goo.gl/V6fDuAz9mju6fcRN8" target="_blank" className="bg-transparent text-gray-900 font-medium cursor-pointer location-button">Verbena Eventos</a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Additional Info */}
                            <motion.div className="bg-gray-200 p-4 rounded-lg text-start" variants={staggerItemXPositive}>
                                <p className="text-sm text-gray-700">
                                    <strong>Código de vestimenta:</strong> Etiqueta Rigurosa
                                </p>
                            </motion.div>

                        </div>

                        <motion.div className="mt-8 space-y-4">
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                
                                <DialogTrigger asChild>
                                    <motion.div variants={staggerItemXNegative}>
                                        <Button className="w-full text-white cursor-pointer">Confirma ahora</Button>
                                    </motion.div>
                                    
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto scrollbar-hide" aria-describedby="rsvp-modal">
                                    <DialogHeader>
                                        <DialogTitle className="text-3xl font-montserrat font-bold text-center">RSVP</DialogTitle>
                                    </DialogHeader>

                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-montserrat text-lg font-semibold">Nombre</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder={guest?.name || undefined} disabled className="font-montserrat placeholder:text-black placeholder:font-semibold"/>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                        
                                            
                                            <FormField
                                                control={form.control}
                                                name="attendance"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                       <FormLabel className="font-montserrat text-lg font-semibold">Asistirás? *</FormLabel> 

                                                       <FormControl>
                                                            <RadioGroup className="flex flex-col space-y-1" onValueChange={field.onChange} defaultValue={field.value}>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="yes" id="yes"/>
                                                                    <label htmlFor="yes" className="text-sm font-montserrat leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Si, ahí estaré! 🎉</label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="no" id="no"/>
                                                                    <label htmlFor="no" className="text-sm font-montserrat leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lo siento, no podré asistir 😢</label>

                                                                </div>
                                                            </RadioGroup>
                                                       </FormControl>
                                                       <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <AnimatePresence mode="wait">
                                            {form.watch("attendance") === "yes" && (
                                                <motion.div 
                                                    className="space-y-4" 
                                                    initial={{ opacity: 0, y: 20, height: 0 }} 
                                                    animate={{ opacity: 1, y: 0, height: "auto" }} 
                                                    exit={{ opacity: 0, y: -20, height: 0 }} 
                                                    transition={{ duration: 0.5, ease: "easeInOut", height: { duration: 0.5 } }}
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.2, duration: 0.4 }}
                                                    >
                                                        <FormField
                                                            control={form.control}
                                                            name="guests"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className="font-montserrat">Número de acompañantes (incluyendo a ti) *</FormLabel>
                                                                    <Select  value={field.value?.toString() || "1"} onValueChange={(value) => field.onChange(parseInt(value))}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Selecciona el número de acompañantes" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {Array.from({ length: maxGuestsNumber }, (_, i) => i + 1).map((num) => (
                                                                                <SelectItem key={num} value={num.toString()}>
                                                                                    {num} {num === 1 ? 'persona' : 'personas'}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        
                                                        />
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.4, duration: 0.4 }}
                                                    >
                                                        <FormField
                                                            control={form.control}
                                                            name="dietaryRestrictions"
                                                            render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="font-montserrat">Restricciones Alimentarias o Alergias</FormLabel>
                                                                <FormControl>
                                                                <Textarea
                                                                    placeholder="Por favor, cuéntanos sobre cualquier restricción alimentaria o alergia..."
                                                                    className="resize-none"
                                                                    {...field}
                                                                />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                            )}
                                                        />
                                                    </motion.div>

                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.6, duration: 0.4 }}
                                                    >

                                                    <FormField
                                                        control={form.control}
                                                        name="specialRequests"
                                                        render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="font-montserrat">Solicitudes Especiales o Mensajes</FormLabel>
                                                            <FormControl>
                                                            <Textarea
                                                                placeholder="Cualquier solicitud especial, necesidades de accesibilidad, o un mensaje para la pareja..."
                                                                className="resize-none"
                                                                {...field}
                                                            />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                        )}
                                                    />
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                            </AnimatePresence>

                                            <Button type="submit" className="w-full cursor-pointer">
                                                Enviar respuesta
                                            </Button>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </motion.div>
                    </CardContent>
                </motion.div>
            </div>
        </div>
    )
}
