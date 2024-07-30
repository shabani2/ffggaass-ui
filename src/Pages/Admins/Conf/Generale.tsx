import React from 'react'
import { Stack, Typography, Button } from '@mui/material'
import { UploadIcon, DownloadIcon} from 'lucide-react'

const Generale = () => {
  return (
    <>
       <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Configuration Generale</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        {/* <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleAddClick}>
            Nouveau
          </Button>
        </div> */}
      </Stack>
    </>
  )
}

export default Generale
