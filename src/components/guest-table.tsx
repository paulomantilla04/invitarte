import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft, ChevronRight, Link } from "lucide-react";
import { supabase } from "@/config/supabaseClient";
import { useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

type Guest = {
    id: number;
    name: string;
    guests: number;
    confirmed: boolean;
};

export default function GuestTable() {

    const [guests, setGuests] = useState<Guest[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 5;
    const isMobile = useMobile();
    const [filter, setFilter] = useState<string | null>(null);

    useEffect(() => {
        const fetchGuests = async () => {
            const { data, error } = await supabase
                .from("guests")
                .select("*")
                .order("id", { ascending: true });

            if (error) {
                console.error("Error fetching guests:", error);
            } else {
                setGuests(data as Guest[]);
            }
        };

        fetchGuests();
    }, []);

    const handleFilterChange = (value: string) => {
        if (value === "all") {
            setFilter(null);

        } else if (value === "true") {
            setFilter("true");
        } else if (value === "false") {
            setFilter("false");
        } else if (value === "pending") {
            setFilter("pending");
        }

        setPageIndex(0);
    }
    
    const filteredGuests = guests.filter((guest) => {
        if (filter === null) return true;
        if (filter === "true") return guest.confirmed === true;
        if (filter === "false") return guest.confirmed === false;
        if (filter === "pending") return guest.confirmed === null;
    })

    // calculate pagination
    const pageCount = Math.ceil(filteredGuests.length / pageSize);
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const currentGuests = filteredGuests.slice(start, end);

    const nextPage = () => {
        if (pageIndex < pageCount - 1) {
            setPageIndex(pageIndex + 1);
        }
    }

    const previousPage = () => {
        if (pageIndex > 0) {
            setPageIndex(pageIndex - 1);
        }
    }



    const copyURL = (guestId: string) => {
        const url = `${window.location.origin}/invitation/${guestId}`;

        if (!navigator.clipboard) {
            console.warn("Clipboard API no está soportada en este navegador");
            toast.error("Tu navegador no permite copiar al portapapeles automáticamente");
            return;
        }

        navigator.clipboard.writeText(url)
            .then(() => {
                toast.success("URL copiada al portapapeles", {duration: 1000});
            })
            .catch((error) => {
                console.error("Error al copiar la URL:", error);
                toast.error("Error al copiar la URL");
            });
    };

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
                                <TableCell colSpan={4} className="text-center font-semibold text-gray-400 ">
                                    <span>No hay invitados disponibles</span>
                                </TableCell>
                            </TableRow>
                            ) : (
                            currentGuests.map((guest) => (
                                <TableRow key={guest.id}>
                                <TableCell className="font-medium">{guest.name}</TableCell>
                                <TableCell className="text-center">{guest.guests ?? "--"}</TableCell>
                                <TableCell className="text-center">
                                    <Button 
                                        variant="outline" size={isMobile ? "icon" : "default"} className="cursor-pointer" 
                                        onClick={() => copyURL(guest.id.toString())}
                                    >
                                        <Link className="h-5 w-5" />
                                        {!isMobile && <span className="ml-2">URL</span>}
                                        {isMobile && <span className="sr-only">URL</span>}
                                    </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        className={`${
                                            guest.confirmed === true
                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                            : guest.confirmed === false
                                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                        }`}
                                        >
                                        {guest.confirmed === true
                                            ? "Confirmado"
                                            : guest.confirmed === false
                                            ? "Cancelado"
                                            : "Pendiente"}
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
                    <Select value={filter === null ? "all" : filter === "true" ? "true" : filter === "false" ? "false" : "pending"} onValueChange={handleFilterChange}>
                        <SelectTrigger className="h-8 w-[100px]">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent side="top">
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="true">Confirmado</SelectItem>
                            <SelectItem value="false">Cancelado</SelectItem>
                            <SelectItem value="pending">Pendiente</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={previousPage} disabled={pageIndex === 0} className="cursor-pointer">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Página anterior</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextPage} disabled={pageIndex === pageCount - 1} className="cursor-pointer">
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Página siguiente</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}