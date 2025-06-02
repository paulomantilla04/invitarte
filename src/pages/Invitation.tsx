import { supabase } from '@/config/supabaseClient';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HashLoader } from "react-spinners";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import imageA from '@/assets/wedding-1.png';
import imageB from '@/assets/wedding-2.png';
import imageC from '@/assets/wedding-3.png';
import { TextAnimate } from '@/components/magicui/text-animate';


interface Guest {
    name: string;
    guests: number | null;
    confirmed: boolean;
}

const Invitation = () => {

    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [guest, setGuest] = useState<Guest | null>(null);
    const [loadingGuestA, setLoadingGuestA] = useState<boolean>(false);
    const [loadingGuestB, setLoadingGuestB] = useState<boolean>(false);


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

    const handleConfirm = async () => {
        setLoadingGuestA(true);

        const guestData: Guest = {
            name: guest?.name || "",
            guests: 0,
            confirmed: true,
        }

        try {
            const {data, error} = await supabase
                .from("guests")
                .update([guestData])
                .eq("id", id)
                .select();
            
            if (error) throw error;

            if (data) {
                toast.success("Asistencia confirmada");
            }
        } catch (error) {
            console.error("Error confirming guest:", error);
            toast.error("Error al confirmar la asistencia");
        } finally {
            setLoadingGuestA(false);
        }
    }

    const handleCancel = async () => {
        setLoadingGuestB(true);

        const guestData: Guest = {
            name: guest?.name || "",
            guests: null,
            confirmed: false,
        }

        try {
            const {data, error} = await supabase
                .from("guests")
                .update([guestData])
                .eq("id", id)
                .select();
            
            if (error) throw error;

            if (data) {
                toast.error("Asistencia cancelada");
            }
        } catch (error) {
            console.error("Error canceling guest:", error);
            toast.error("Error al cancelar la asistencia");
        } finally {
            setLoadingGuestB(false);
        }
    }


  return (
    <main className='flex flex-col items-center lg:items-center justify-center p-6 md:p-24 text-center bg-[#E9E9E6]'>
        <section className='-mt-10'>

            <motion.h1 className='text-7xl mb-4 font-italiana' initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ ease: "easeInOut", duration: 0.5 }}>
                A & B
            </motion.h1>

            <div className="flex flex-row gap-2">
                <motion.img src={imageA} alt="" className='h-[30rem]' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: "easeInOut", duration: 0.4 }}/>
                <motion.img src={imageB} alt="" className='h-[30rem]' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 25 }} transition={{ ease: "easeInOut", duration: 0.4 }}/>
                <motion.img src={imageC} alt="" className='h-[30rem]' initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: "easeInOut", duration: 0.4 }}/>
            </div>

            <p className='text-3xl mt-10 font-inria'>31.08.2025</p>
        </section>
    </main>
  )
}

export default Invitation