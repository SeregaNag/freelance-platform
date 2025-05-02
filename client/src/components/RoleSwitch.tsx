'use client';

import { RootState } from "@/store/store";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "@/features/userSlice";
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';

export default function RoleSwitch() {
    const dispatch = useDispatch();
    const role = useSelector((state: RootState) => state.user.role);

    return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3,
            '& .MuiToggleButtonGroup-root': {
                backgroundColor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                border: '1px solid #e0e0e0'
            },
            '& .MuiToggleButton-root': {
                border: 'none',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'text.secondary',
                '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'primary.dark',
                    }
                },
                '&:hover': {
                    backgroundColor: 'action.hover',
                }
            }
        }}>
            <ToggleButtonGroup 
                value={role}
                exclusive
                onChange={(_, newRole) => dispatch(setRole(newRole))}
                size="small"
            >
                <ToggleButton value="freelancer">
                    <WorkIcon sx={{ mr: 1, fontSize: '1rem' }} />
                    Фрилансер
                </ToggleButton>
                <ToggleButton value="client">
                    <PersonIcon sx={{ mr: 1, fontSize: '1rem' }} />
                    Заказчик
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    )
}