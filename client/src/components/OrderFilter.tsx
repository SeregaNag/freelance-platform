"use client";

import { useState } from "react";
import { 
  Box, 
  Button, 
  Chip, 
  Divider, 
  Drawer, 
  FormControl, 
  IconButton, 
  InputAdornment, 
  InputLabel, 
  MenuItem, 
  OutlinedInput, 
  Paper, 
  Select, 
  Slider, 
  Stack, 
  TextField, 
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { 
  setStatusFilter, 
  setSearchQuery, 
  setPriceRange, 
  addCategory, 
  removeCategory, 
  addSkill, 
  removeSkill, 
  clearAllFilters
} from "@/features/filterSlice";
import { RootState } from "@/store/store";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { OrderStatusFilter } from "@/types/order";
import SortMenu from './SortMenu';

// Примерные данные для категорий и навыков
const CATEGORIES = [
  "Веб-разработка",
  "Мобильная разработка",
  "Дизайн",
  "Маркетинг",
  "Копирайтинг",
  "SEO",
  "Администрирование",
  "Обработка данных",
  "Аналитика",
  "Другое"
];

const SKILLS = [
  "JavaScript",
  "React",
  "Python",
  "PHP",
  "Node.js",
  "Java",
  "HTML/CSS",
  "TypeScript",
  "UI/UX",
  "SQL",
  "Angular",
  "Vue.js",
  "Figma",
  "Photoshop",
  "Flutter",
  "React Native",
  "Django",
  "Laravel",
  "WordPress",
  "Docker"
];

const STATUS_FILTERS: Record<OrderStatusFilter, string> = {
  "all": "Все",
  "pending": "Свободные",
  "waiting_confirmation": "Ожидающие",
  "in_progress": "В работе",
  "completed": "Выполненные",
  "cancelled": "Отмененные"
};

export default function OrderFilter() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [priceRangeLocal, setPriceRangeLocal] = useState<[number, number]>([0, 50000]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  const { 
    status,
    searchQuery,
    selectedCategories,
    selectedSkills,
    priceRange 
  } = useSelector((state: RootState) => state.filters);

  // Количество активных фильтров
  const activeFiltersCount = 
    (searchQuery ? 1 : 0) + 
    (status !== 'all' ? 1 : 0) + 
    selectedCategories.length + 
    selectedSkills.length + 
    ((priceRange.min !== null || priceRange.max !== null) ? 1 : 0);
  
  const handleStatusChange = (status: OrderStatusFilter) => {
    dispatch(setStatusFilter(status));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };
  
  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRangeLocal(newValue as [number, number]);
    }
  };
  
  const handlePriceRangeCommit = (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      dispatch(setPriceRange({ 
        min: newValue[0] || null, 
        max: newValue[1] || null 
      }));
    }
  };

  const handleAddCategory = () => {
    if (selectedCategory) {
      dispatch(addCategory(selectedCategory));
      setSelectedCategory("");
    }
  };
  
  const handleRemoveCategory = (category: string) => {
    dispatch(removeCategory(category));
  };
  
  const handleAddSkill = () => {
    if (selectedSkill) {
      dispatch(addSkill(selectedSkill));
      setSelectedSkill("");
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    dispatch(removeSkill(skill));
  };
  
  const handleClearAllFilters = () => {
    dispatch(clearAllFilters());
    setPriceRangeLocal([0, 50000]);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        mb: 3, 
        border: '1px solid #e0e0e0',
        borderRadius: 2
      }}
    >
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Найти заказ..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => dispatch(setSearchQuery(""))}
                  edge="end"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
          sx={{ mb: 1.5 }}
        />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 0.5, 
            flex: 1, 
            maxWidth: '100%', 
            overflow: 'hidden'
          }}>
            {Object.entries(STATUS_FILTERS).map(([key, label]) => (
              <Chip 
                key={key}
                label={label}
                clickable
                size="small"
                color={status === key ? "primary" : "default"}
                variant={status === key ? "filled" : "outlined"}
                onClick={() => handleStatusChange(key as OrderStatusFilter)}
                sx={{ height: '28px' }}
              />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, mt: { xs: 1, sm: 0 } }}>
            <SortMenu />
            <Button 
              variant="outlined"
              size="small"
              startIcon={<FilterListIcon sx={{ fontSize: '0.875rem' }} />}
              onClick={() => setIsFilterDrawerOpen(true)}
              color={activeFiltersCount > (status !== 'all' ? 1 : 0) ? "primary" : "inherit"}
              sx={{ 
                whiteSpace: 'nowrap',
                height: '32px',
                px: 1.5
              }}
            >
              Фильтры
              {activeFiltersCount > (status !== 'all' ? 1 : 0) && (
                <Box 
                  component="span" 
                  sx={{ 
                    ml: 1, 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    borderRadius: '50%', 
                    width: 20, 
                    height: 20, 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: 11
                  }}
                >
                  {activeFiltersCount - (status !== 'all' ? 1 : 0)}
                </Box>
              )}
            </Button>
          </Box>
        </Box>
        
        {/* Активные фильтры чипсы */}
        {activeFiltersCount > 0 && (
          <Box sx={{ mt: 1.5 }}>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ gap: '4px !important' }}>
              {status !== 'all' && (
                <Chip 
                  label={`Статус: ${STATUS_FILTERS[status]}`}
                  onDelete={() => handleStatusChange('all')}
                  size="small"
                  sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                />
              )}
              
              {searchQuery && (
                <Chip 
                  label={`Поиск: ${searchQuery}`}
                  onDelete={() => dispatch(setSearchQuery(""))}
                  size="small"
                  sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                />
              )}
              
              {(priceRange.min !== null || priceRange.max !== null) && (
                <Chip 
                  label={`Цена: ${priceRange.min || 0} - ${priceRange.max || '∞'} ₽`}
                  onDelete={() => dispatch(setPriceRange({ min: null, max: null }))}
                  size="small"
                  sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                />
              )}
              
              {selectedCategories.map(category => (
                <Chip 
                  key={category}
                  label={`Категория: ${category}`}
                  onDelete={() => handleRemoveCategory(category)}
                  size="small"
                  sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                />
              ))}
              
              {selectedSkills.map(skill => (
                <Chip 
                  key={skill}
                  label={`Навык: ${skill}`}
                  onDelete={() => handleRemoveSkill(skill)}
                  size="small"
                  sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                />
              ))}
              
              {activeFiltersCount > 1 && (
                <Chip 
                  label="Очистить все"
                  onDelete={handleClearAllFilters}
                  deleteIcon={<DeleteIcon sx={{ fontSize: '0.875rem' }} />}
                  color="error"
                  size="small"
                  sx={{ height: '24px', '& .MuiChip-label': { fontSize: '0.75rem' } }}
                />
              )}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Выдвижная панель с расширенными фильтрами */}
      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 320,
            height: isMobile ? '70%' : '100%',
            p: 3,
            borderTopLeftRadius: isMobile ? 16 : 0,
            borderTopRightRadius: isMobile ? 16 : 0
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterAltIcon sx={{ mr: 1 }} />
            Фильтры
          </Typography>
          <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Ценовой диапазон */}
        <Typography variant="subtitle2" gutterBottom>
          Ценовой диапазон
        </Typography>
        <Box sx={{ px: 1, mb: 4 }}>
          <Slider
            value={priceRangeLocal}
            onChange={handlePriceRangeChange}
            onChangeCommitted={handlePriceRangeCommit}
            valueLabelDisplay="auto"
            min={0}
            max={50000}
            step={1000}
            valueLabelFormat={(value) => `${value} ₽`}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {priceRangeLocal[0]} ₽
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {priceRangeLocal[1]} ₽
            </Typography>
          </Box>
        </Box>
        
        {/* Категории */}
        <Typography variant="subtitle2" gutterBottom>
          Категории
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', mb: 1 }}>
            <FormControl fullWidth size="small" sx={{ mr: 1 }}>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Выберите категорию
                </MenuItem>
                {CATEGORIES.filter(cat => !selectedCategories.includes(cat)).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              size="small"
              onClick={handleAddCategory}
              disabled={!selectedCategory}
            >
              Добавить
            </Button>
          </Box>
          {selectedCategories.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {selectedCategories.map((category) => (
                <Chip 
                  key={category}
                  label={category}
                  onDelete={() => handleRemoveCategory(category)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              ))}
            </Stack>
          )}
        </Box>
        
        {/* Навыки */}
        <Typography variant="subtitle2" gutterBottom>
          Навыки
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', mb: 1 }}>
            <FormControl fullWidth size="small" sx={{ mr: 1 }}>
              <Select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Выберите навык
                </MenuItem>
                {SKILLS.filter(skill => !selectedSkills.includes(skill)).map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              variant="contained"
              size="small"
              onClick={handleAddSkill}
              disabled={!selectedSkill}
            >
              Добавить
            </Button>
          </Box>
          {selectedSkills.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {selectedSkills.map((skill) => (
                <Chip 
                  key={skill}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              ))}
            </Stack>
          )}
        </Box>
        
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button 
            fullWidth 
            variant="outlined" 
            color="inherit" 
            onClick={handleClearAllFilters}
            sx={{ mb: 1 }}
          >
            Очистить все фильтры
          </Button>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => setIsFilterDrawerOpen(false)}
          >
            Применить
          </Button>
        </Box>
      </Drawer>
    </Paper>
  );
}
