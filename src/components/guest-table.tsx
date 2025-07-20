import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft, ChevronRight, Link} from "lucide-react";
import { supabase } from "@/config/supabaseClient";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import InformationModal from "./InformationModal";

type Guest = {
    id: number;
    name: string;
    guests: number;
    confirmed: boolean | null;
    dietaryRestrictions: string | null;
    specialRequests: string | null;
    maxGuests: number;
};

type FilterType = "all" | "confirmed" | "cancelled" | "pending";



export default function GuestTable() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [filter, setFilter] = useState<FilterType>("all");
    const [isLoading, setIsLoading] = useState(true);

    const pageSize = 5;
    const isMobile = useMobile();

    const fetchGuests = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("guests")
                .select("*")
                .order("id", { ascending: true });

            if (error) {
                console.error("Error fetching guests:", error);
                toast.error("Error al cargar los invitados");
            } else {
                setGuests(data as Guest[]);
            }
        } catch (error) {
            console.error("Unexpected error: ", error);
            toast.error("Error inesperado al cargar los invitados");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGuests();

        // Configurar suscripción en tiempo real
        const subscription = supabase
            .channel('guests-channel')
            .on(
                'postgres_changes',
                {
                    event: '*', // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'guests'
                },
                (payload) => {
                    console.log('Cambio en tiempo real:', payload);
                    
                    if (payload.eventType === 'INSERT') {
                        // Agregar nuevo invitado
                        setGuests(prevGuests => [...prevGuests, payload.new as Guest]);
                        toast.success(`Nuevo invitado agregado: ${payload.new.name}`);
                    } else if (payload.eventType === 'UPDATE') {
                        // Actualizar invitado existente
                        setGuests(prevGuests => 
                            prevGuests.map(guest => 
                                guest.id === payload.new.id ? payload.new as Guest : guest
                            )
                        );
                        toast.info(`Invitado actualizado: ${payload.new.name}`);
                    } else if (payload.eventType === 'DELETE') {
                        // Eliminar invitado
                        setGuests(prevGuests => 
                            prevGuests.filter(guest => guest.id !== payload.old.id)
                        );
                        toast.info(`Invitado eliminado: ${payload.old.name}`);
                    }
                }
            )
            .subscribe();

        // Cleanup: cancelar suscripción cuando el componente se desmonte
        return () => {
            subscription.unsubscribe();
        };
    }, [fetchGuests]);

    const handleFilterChange = (value: FilterType) => {
        setFilter(value);
        setPageIndex(0);
    }

    const filteredGuests = guests.filter((guest) => {
        if (filter === "all") return true;
        if (filter === "confirmed") return guest.confirmed === true;
        if (filter === "cancelled") return guest.confirmed === false;
        if (filter === "pending") return guest.confirmed === null;
        return false;
    });

    // Calculate pagination
    const pageCount = Math.ceil(filteredGuests.length / pageSize);
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const currentGuests = filteredGuests.slice(start, end);

    // Reset to first page if current page is out of bounds after filtering
    useEffect(() => {
        if (pageIndex >= pageCount && pageCount > 0) {
            setPageIndex(0);
        }
    }, [pageIndex, pageCount]);

    const nextPage = () => {
        if (pageIndex < pageCount - 1) {
            setPageIndex(prev => prev + 1);
        }
    }

    const previousPage = () => {
        if (pageIndex > 0) {
            setPageIndex(prev => prev - 1);
        }
    }

    
    const copyURL = async (guestId: string) => {
        const url = `${window.location.origin}/invitation/${guestId}`;

        if (!navigator.clipboard) {
            console.warn("Clipboard API no está soportada en este navegador");
            toast.error("Tu navegador no permite copiar al portapapeles automáticamente");
            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            toast.success("URL copiada al portapapeles", { duration: 1000 });
        } catch (error) {
            console.error("Error al copiar la URL:", error);
            toast.error("Error al copiar la URL");
        }
    };
    

    const getBadgeStyles = (confirmed: boolean | null) => {
        if (confirmed === true) {
            return "bg-green-100 text-green-800 hover:bg-green-200";
        } 

        if (confirmed === false) {
            return "bg-red-100 text-red-800 hover:bg-red-200";
        }

        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    }

    const getBadgeText = (confirmed: boolean | null) => {
        if (confirmed === true) return "Confirmado";
        if (confirmed === false) return "Cancelado";
        return "Pendiente";
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-black hover:bg-[#2a2a2a]">
                                <TableHead className="w-[50%] text-white">Nombre</TableHead>
                                <TableHead className="text-center text-white">Núm. de acompañantes</TableHead>
                                <TableHead className="text-center text-white">Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={4} className="text-center font-semibold text-gray-400">
                                    <span>Cargando invitados...</span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-black hover:bg-[#2a2a2a]">
                            <TableHead className="w-[50%] text-white">Nombre</TableHead>
                            <TableHead className="text-center text-white">Núm. de acompañantes</TableHead>
                            <TableHead className="text-center text-white">Acciones</TableHead>
                            <TableHead className="text-center text-white">Estado</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {currentGuests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center font-semibold text-gray-400">
                                    <span>
                                        {filteredGuests.length === 0 && guests.length > 0
                                            ? "No se encontraron invitados con el filtro aplicado"
                                            : "No hay invitados para mostrar"
                                        }
                                    </span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentGuests.map((guest) => (
                                <TableRow key={guest.id}>
                                    <TableCell className="font-medium">{guest.name}</TableCell>
                                    <TableCell className="text-center">{guest.guests ?? "--"}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="outline"
                                                size={isMobile ? "icon" : "default"}
                                                className="cursor-pointer"
                                                onClick={() => copyURL(guest.id.toString())}
                                                aria-label={`Copiar URL de invitación para ${guest.name}`}
                                            >
                                                <Link className="h-5 w-5" />
                                                {!isMobile && <span className="ml-2">URL</span>}
                                                {isMobile && <span className="sr-only">URL</span>}
                                            </Button>

                                            <InformationModal disabled={!guest.confirmed} guestData={guest}/>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={getBadgeStyles(guest.confirmed)}>
                                            {getBadgeText(guest.confirmed)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Filtrar por estado</p>
                    <Select value={filter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="h-8 w-[120px]">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent side="top">
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="confirmed">Confirmados</SelectItem>
                            <SelectItem value="cancelled">Cancelados</SelectItem>
                            <SelectItem value="pending">Pendientes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={previousPage}
                        disabled={pageIndex === 0 || pageCount === 0}
                        className="cursor-pointer"
                        aria-label="Página anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Página anterior</span>
                    </Button>

                    <span className="text-xs text-gray-500 hidden lg:block">
                        {pageCount > 0 ? `${pageIndex + 1} de ${pageCount}` : "0 de 0"}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={pageIndex >= pageCount - 1 || pageCount === 0}
                        className="cursor-pointer"
                        aria-label="Página siguiente"
                    >
                        <span className="sr-only">Página siguiente</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}