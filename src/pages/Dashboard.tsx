import { UserAuth } from "@/context/AuthContext";
import GuestTable from "@/components/guest-table";
import { Navbar } from "@/components/Navbar";
import { motion } from "motion/react";


const Dashboard = () => {

    const { session } = UserAuth();
    const userName = session?.user.user_metadata.first_name || 'Paulo';

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex flex-col items-center justify-center w-full p-6 mt-16">
            <motion.h1 className="text-4xl lg:text-5xl font-montserrat font-extrabold text-black mb-4" initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.1 }}>
                Hola, <span className="bg-gradient-to-r from-black to-emerald-700 inline-block text-transparent bg-clip-text">{userName}</span>!
            </motion.h1>
            <motion.p className="text-sm lg:text-lg text-gray-600 mb-6 font-montserrat text-center" initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                Bienvenid@ a tu panel de control. Aquí puedes crear y gestionar invitaciones.
            </motion.p>
            <motion.div className="w-full md:w-3/4 lg:w-2/3 mx-auto mt-4 mb-8" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <GuestTable />
            </motion.div>
        </main>
    </div>
  )
}

export default Dashboard