import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import imageA from '@/assets/wedding-1.avif';
import imageB from '@/assets/wedding-2.avif';
import imageC from '@/assets/wedding-3.avif';
import InvitationModal from '@/components/InvitationModal';


const Invitation = () => {


    const section2Ref = useRef<HTMLDivElement>(null);

    const section2InView = useInView(section2Ref, {
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

    const [timeRemaining, setTimeRemaining] = useState<{ days: number, hours: number, minutes: number, seconds: number }>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    
    useEffect(() => {

        const targetDate = new Date("2025-08-31T18:00:00");

        const interval = setInterval(() => {
            setTimeRemaining(calculateTimeRemaining(targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const calculateTimeRemaining = (target: Date) => {
        const now = new Date();
        const targetTime = new Date(target);

        const difference = targetTime.getTime() - now.getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }






  return (
        <main className='flex flex-col items-center lg:items-center justify-center p-6 md:p-24 text-center bg-[#E9E9E6]'>
            <motion.section 
                className=' lg:mr-0 lg:-mt-10'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Título con animación independiente */}
                <motion.h1 
                    className='text-5xl lg:text-7xl mb-4 font-italiana' 
                    initial={{ opacity: 0, filter: 'blur(10px)' }} 
                    animate={{ opacity: 1, filter: 'blur(0px)' }} 
                    transition={{ ease: "easeInOut", duration: 0.5, delay: 0.1 }}
                >
                    A & B
                </motion.h1>

                {/* Contenedor de imágenes con stagger */}
                <motion.div 
                    className="flex flex-row gap-1 lg:gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <motion.img 
                        src={imageA} 
                        alt="" 
                        className='h-[14rem] lg:h-[30rem]' 
                        initial={{ opacity: 0, y: 50 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ ease: "easeInOut", duration: 0.4, delay: 0.4 }}
                    />
                    <motion.img 
                        src={imageB} 
                        alt="" 
                        className='h-[14rem] lg:h-[30rem]' 
                        initial={{ opacity: 0, y: 50 }} 
                        animate={{ opacity: 1, y: 25 }} 
                        transition={{ ease: "easeInOut", duration: 0.4, delay: 0.5 }}
                    />
                    <motion.img 
                        src={imageC} 
                        alt="" 
                        className='h-[14rem] lg:h-[30rem]' 
                        initial={{ opacity: 0, y: 50 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ ease: "easeInOut", duration: 0.4, delay: 0.6 }}
                    />
                </motion.div>

                {/* Fecha con delay mayor para evitar conflictos */}
                <motion.p 
                    className='text-xl lg:text-3xl mt-10 font-inria' 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ 
                        ease: "easeInOut", 
                        duration: 0.6, 
                        delay: 0.8,
                        type: "spring",
                        stiffness: 100
                    }}
                >
                    31.08.2025
                </motion.p>
            </motion.section>

            <motion.section className='flex flex-col items-center justify-center mt-20' ref={section2Ref} variants={staggerContainer} initial="hidden" animate={section2InView ? "visible" : "hidden"}>
                <motion.p className='text-md lg:text-2xl font-inria text-center px-4' variants={staggerItem}>
                    En este camino llamado amor, hemos encontrado el
                    momento perfecto para unir nuestras vidas. Te 
                    invitamos a compartir este gran día con nosotros.
                </motion.p>
                
                <motion.div className='flex flex-col items-center justify-center mt-10' variants={staggerItem}>
                    <motion.h2 className='text-xl lg:text-4xl font-gideon uppercase'>
                        Cuenta regresiva
                    </motion.h2>

                    <motion.div className='flex flex-row gap-6 lg:gap-8 mt-4 mb-10'>
                        <motion.p className='flex flex-col items-center'>
                            <motion.span className='text-2xl lg:text-4xl font-freeman' variants={staggerItemXPositive}>{timeRemaining.days}</motion.span>
                            <motion.span className='text-sm lg:text-lg font-gideon uppercase' variants={staggerItemXNegative}>Dias</motion.span>
                        </motion.p>
                        <motion.p className='flex flex-col items-center'>
                            <motion.span className='text-2xl lg:text-4xl font-freeman' variants={staggerItemXPositive}>{timeRemaining.hours}</motion.span>
                            <motion.span className='text-sm lg:text-lg font-gideon uppercase' variants={staggerItemXNegative}>HORAS</motion.span>
                        </motion.p>
                        <motion.p className='flex flex-col items-center'>
                            <motion.span className='text-2xl lg:text-4xl font-freeman' variants={staggerItemXPositive}>{timeRemaining.minutes}</motion.span>
                            <motion.span className='text-sm lg:text-lg font-gideon uppercase' variants={staggerItemXNegative}>MINUTOS</motion.span>
                        </motion.p>
                        <motion.p className='flex flex-col items-center'>
                            <motion.span className='text-2xl lg:text-4xl font-freeman' variants={staggerItemXPositive}>{timeRemaining.seconds}</motion.span>
                            <motion.span className='text-sm lg:text-lg font-gideon uppercase' variants={staggerItemXNegative}>SEGUNDOS</motion.span>
                        </motion.p>
                    </motion.div>
                </motion.div>

            </motion.section>

            <InvitationModal/>
        </main>
  )
}

export default Invitation;