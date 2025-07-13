import { Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import cami from '@/assets/cami.jpg';
import BlurText from "@/components/reactbits/BlurText";
import { supabase } from "@/config/supabaseClient";
import InvitationCamilaDialog from "@/components/ui/InvitationCamilaDialog";
import { useEffect, useState } from "react";

export default function BirthdayInvitation() {

  const [guests, setGuests] = useState<number>(0);

  useEffect(() => {
    async function fetchGuestsCount() {
      const { error, count } = await supabase
        .from('guests-camila')
        .select('*', { count: 'exact' });
  
      if (!error) {
        if (typeof count === 'number') {
          setGuests(count);
        }
      }
    }
    fetchGuestsCount();
  }, []);


  return (
    <div className="min-h-screen w-full bg-gray-900">
      {/* Top Image Section */}
      <div className="w-full h-80 relative overflow-hidden">
        <img
          src={cami}
          alt="Camila sonriendo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Blurred Background Section with Content */}
      <div
        className="relative min-h-[calc(100vh-20rem)] w-full"
        style={{
          backgroundImage: `url(${cami}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Blur and Overlay */}
        <div className="absolute inset-0 backdrop-blur-2xl bg-black/40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-6 pt-8 pb-8 space-y-6">
          {/* Title Section */}
          <div className="text-center space-y-2">
            <BlurText text="Cumpleaños de Camila #2" delay={150} animateBy="words" direction="top" className="text-4xl font-bold text-white drop-shadow-lg font-montserrat flex justify-center"/>
            <div className="space-y-1">
              <BlurText text="Mié, 30 de julio, 3:00 p.m." delay={250} animateBy="words" direction="top" className="text-lg text-white/90 drop-shadow-md font-montserrat flex justify-center"/>
              <BlurText text="Casa de los Abuelos" delay={350} animateBy="words" direction="top" className="text-lg text-white/90 drop-shadow-md font-montserrat flex justify-center"/>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <InvitationCamilaDialog />
            <Button
              className="flex-1 h-12 bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-200 rounded-2xl shadow-lg font-montserrat hover:text-white cursor-pointer"
              onClick={() => {
                window.open("https://maps.app.goo.gl/FRCXr64FC7stGjYQ9?g_st=ic", "_blank")
              }}
              variant="ghost"
            >
              <Map className="w-5 h-5 mr-2" />
              Ver mapa
            </Button>
          </div>

          {/* Organizer Section */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg font-montserrat flex items-center justify-center">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10 border-2 border-white/30">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Paulo Mantilla" />
                <AvatarFallback className="bg-white/20 text-white text-sm font-medium">FM</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-white/90 text-sm font-medium">Organizado por Familia Mantilla</p>
                <p className="text-white/80 text-sm leading-relaxed">Espero puedas asistir a este día tan especial para cami</p>
              </div>
            </div>
          </div>

          {/* Attendee Count */}
          <div className="flex items-center justify-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-3 border border-white/20 shadow-lg w-fit mx-auto">
            <Avatar className="w-6 h-6 border border-white/30">
              <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Asistente" />
              <AvatarFallback className="bg-white/20 text-white text-xs">A</AvatarFallback>
            </Avatar>
            <span className="text-white/90 text-sm font-medium font-montserrat">
                {guests} {guests === 1 ? "asistente" : "asistentes"}
            </span>
      
            </div>
        </div>
      </div>
    </div>
  )
}
