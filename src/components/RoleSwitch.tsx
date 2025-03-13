'use client';

import { RootState } from "@/store/store";
import { UserRole } from "@/types/roles";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "@/features/userSlice";

export default function RoleSwitch() {
    const dispatch = useDispatch();
    const role = useSelector((state: RootState) => state.user.role);

    return (
        <ToggleButtonGroup 
        value={role}
        exclusive
        onChange={(_, newRole) => dispatch(setRole(newRole))}
        >
            <ToggleButton value="freelancer">Фрилансер</ToggleButton>
            <ToggleButton value="client">Заказчик</ToggleButton>
        </ToggleButtonGroup>
    )
}