import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setThemeMode } from '@/features/themeSlice';

export default function ThemeSwitch() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const toggleTheme = () => {
    dispatch(setThemeMode(mode === 'light' ? 'dark' : 'light'));
  };

  return (
    <Tooltip title={mode === 'light' ? 'Включить темную тему' : 'Включить светлую тему'}>
      <IconButton 
        onClick={toggleTheme} 
        color="inherit"
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
          }
        }}
      >
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
} 