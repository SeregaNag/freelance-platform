import { useState } from "react";
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { enqueueSnackbar } from "notistack";
import { createOrder } from "@/api/api";
import { useDispatch } from "react-redux";
import { orderModified } from "@/features/ordersSlice";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Autocomplete, Chip } from '@mui/material';

const SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C#',
  'PHP',
  'HTML',
  'CSS',
  'SQL',
  'MongoDB',
  'Docker',
  'Git',
  'UI/UX Design',
  'Figma',
  'Photoshop',
  'Illustrator',
  'Marketing',
  'SEO',
  'Content Writing',
  'Project Management'
];

interface CreateOrderFormProps {
  onClose: () => void;
}

export default function CreateOrderForm({ onClose }: CreateOrderFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState<string>("web");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [minBudget, setMinBudget] = useState<number>(0);
  const [maxBudget, setMaxBudget] = useState<number>(0);
  const [attachments, setAttachments] = useState<string[]>([]);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newOrder = await createOrder({
        title,
        description,
        price,
        category,
        deadline: deadline?.toISOString(),
        skills,
        minBudget,
        maxBudget,
        attachments
      });
      enqueueSnackbar(`Заказ "${newOrder.title}" успешно создан`, {
        variant: "success",
      });
      dispatch(orderModified(newOrder.id));
    } catch (error) {
      enqueueSnackbar(
        `Ошибка при создании заказа ${(error as Error).message}`,
        { variant: "error" }
      );
      return;
    }
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Название заказа"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
          required
        />

        <FormControl fullWidth>
          <InputLabel>Категория</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Категория"
          >
            <MenuItem value="web">Веб-разработка</MenuItem>
            <MenuItem value="mobile">Мобильная разработка</MenuItem>
            <MenuItem value="design">Дизайн</MenuItem>
            <MenuItem value="marketing">Маркетинг</MenuItem>
          </Select>
        </FormControl>

        <Autocomplete
          multiple
          options={SKILLS}
          value={skills}
          onChange={(_, newValue) => setSkills(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                label={option}
                onDelete={getTagProps({ index }).onDelete}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Навыки"
              placeholder="Выберите навыки"
            />
          )}
        />

        <DatePicker
          label="Срок выполнения"
          value={deadline}
          onChange={(newValue) => setDeadline(newValue)}
        />

        <TextField
          label="Минимальный бюджет"
          type="number"
          value={minBudget || 0}
          onChange={(e) => setMinBudget(Number(e.target.value))}
          fullWidth
        />

        <TextField
          label="Максимальный бюджет"
          type="number"
          value={maxBudget || 0}
          onChange={(e) => setMaxBudget(Number(e.target.value))}
          fullWidth
        />

        <TextField
          label="Цена"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          fullWidth
          required
        />

        <Button variant="contained" color="primary" type="submit">
          Создать
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
