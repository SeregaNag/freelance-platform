import { UserProfile } from "@/types/profile";
import { useState } from "react";
import { Box, Button, Container, TextField, Typography, Grid, Chip, Link } from "@mui/material";
import Image from 'next/image';

interface EditProfileFormProps {
    profile: UserProfile;
    onSave: (updatedProfile: UserProfile) => Promise<void>;
    onCancel: () => void;
}

export default function EditProfileForm({ profile, onSave, onCancel }: EditProfileFormProps) {
    const [formData, setFormData] = useState<UserProfile>(profile);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || null
        }));
    };

    const handleSkillsChange = (skills: string[]) => {
        setFormData(prev => ({
            ...prev,
            skills: skills.length > 0 ? skills : undefined
        }));
    };

    const handleSocialLinkChange = (platform: string, url: string) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: url
            }
        }));
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/avatar`, {
                method: "POST",
                credentials: "include",
                body: formData
            });
            if (!res.ok) {
                throw new Error("Ошибка при загрузке аватара");
            }
            const {url} = await res.json();
            setFormData(prev => ({
                ...prev,
                avatar: url
            }))
        } catch (error) {
            console.error("Ошибка при загрузке аватара", error);
            setError("Ошибка при загрузке аватара");
        }
    }
    const handleSave = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            await onSave(formData);
        } catch (error) {
            setError("Ошибка при сохранении профиля");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box className="bg-white shadow-md rounded p-6">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Редактирование профиля
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Имя"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box className="mb-4">
                        <Typography variant="subtitle1" gutterBottom>
                            Аватар
                        </Typography>
                        <Box className="flex items-center gap-4">
                            {formData.avatar && (
                                <Image
                                    src={formData.avatar}
                                    alt="Аватар"
                                    width={80}
                                    height={80}
                                    className="rounded-full object-cover"
                                />
                            )}
                            <Button
                                variant="outlined"
                                component="label"
                            >
                                Загрузить фото
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="О себе"
                        name="bio"
                        value={formData.bio || ''}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Навыки (через запятую)"
                        value={formData.skills?.join(', ') || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData(prev => ({
                                ...prev,
                                skills: value ? [value] : undefined
                            }));
                        }}
                        onBlur={(e) => {
                            const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            handleSkillsChange(skills);
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Опыт работы"
                        name="experience"
                        value={formData.experience || ''}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Местоположение"
                        name="location"
                        value={formData.location || ''}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Веб-сайт"
                        name="website"
                        value={formData.website || ''}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="GitHub"
                        value={formData.socialLinks?.github || ''}
                        onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="LinkedIn"
                        value={formData.socialLinks?.linkedin || ''}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box className="flex justify-end gap-2">
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </Box>
                </Grid>

                {error && (
                    <Grid item xs={12}>
                        <Typography color="error">
                            {error}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}
