import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from './ui/button';
import { Eye } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface InformationModalProps {
    disabled: boolean;
    guestData: {
        name: string;
        dietaryRestrictions: string | null;
        specialRequests: string | null;
    }
}

const InformationModal = ({ disabled, guestData }: InformationModalProps) => {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" size={"icon"} className="cursor-pointer" disabled={disabled}>
                <Eye className="h-5 w-5" />
            </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto scrollbar-hide" aria-describedby="rsvp-modal">
            <DialogHeader>
                <DialogTitle className='text-2xl font-montserrat font-bold text-center'>Información adicional</DialogTitle>
            </DialogHeader>

            <div className='flex flex-col gap-4'>
                <p className='text-lg font-montserrat font-bold'>{guestData.name}</p>
                <Label className='font-montserrat font-bold'>Alergias</Label>
                <Textarea value={guestData.dietaryRestrictions || 'No hay alergias'} disabled className='resize-none'/>
                <Label className='font-montserrat font-bold'>Peticiones especiales / Mensaje</Label>
                <Textarea value={guestData.specialRequests || 'No hay peticiones especiales'} disabled className='resize-none'/>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default InformationModal;