import { Box, Skeleton, Typography } from "@mui/material";

export default function OrderLoading() {
  return (
    <Box>
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box>
          <Skeleton variant="text" width={120} />
          <Skeleton variant="text" width={80} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton variant="rectangular" width={120} height={36} />
        <Skeleton variant="rectangular" width={120} height={36} />
      </Box>
    </Box>
  );
} 