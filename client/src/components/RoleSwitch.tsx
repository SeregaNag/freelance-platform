'use client';

import { RootState } from "@/store/store";
import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "@/features/userSlice";
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import { motion, AnimatePresence } from "framer-motion";

export default function RoleSwitch() {
    const dispatch = useDispatch();
    const role = useSelector((state: RootState) => state.user.role);

    return (
        <Box sx={{ mb: 4 }}>
            <ToggleButtonGroup 
                value={role}
                exclusive
                onChange={(_, newRole) => dispatch(setRole(newRole))}
                size="small"
                sx={{
                    '& .MuiToggleButton-root': {
                        transition: 'all 0.3s ease',
                        '&.Mui-selected': {
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            color: 'white',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                            }
                        }
                    }
                }}
            >
                <ToggleButton value="freelancer">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <WorkIcon sx={{ mr: 1, fontSize: '1rem' }} />
                        Фрилансер
                    </motion.div>
                </ToggleButton>
                <ToggleButton value="client">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PersonIcon sx={{ mr: 1, fontSize: '1rem' }} />
                        Заказчик
                    </motion.div>
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    )
}