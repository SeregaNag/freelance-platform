import { Button, Container } from "@mui/material"

export default function OrderFilter() {
    return (
        <Container>
            <Button variant="contained" color="secondary">Все</Button>
            <Button variant="contained" sx={{ bgcolor: 'customStatus.completed' }}>Выполненные</Button>
            <Button variant="contained" sx={{ bgcolor: 'customStatus.pending' }}>В процессе</Button>
            <Button variant="contained" sx={{ bgcolor: 'customStatus.canceled' }}>Отмененные</Button>
        </Container>
    )
}