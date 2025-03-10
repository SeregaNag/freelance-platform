import { Paper,Typography, Container } from "@mui/material"
import { useEffect, useState } from "react";

export default function OrderCard() {
    const [status, setStatus] = useState("Completed");
    const [statusColor, setStatusColor] = useState("black");

    useEffect(() => {
        if (status === "Completed") {
            setStatusColor("green");
        } else if (status === "Pending") {
            setStatusColor("yellow");
        } else if (status === "Canceled") {
            setStatusColor("grey");
        }
    }, []);
    


    return (
        <Paper elevation={3} sx={{p:2, mb:2}}>
            <Typography variant="h5">Создать SPA, на Next.js</Typography>
            <Typography variant="subtitle1">Цена: 1000 руб</Typography>
            <Typography variant="subtitle2" color={statusColor}>Статус: {status}</Typography>
        </Paper>
    )
}