
import GeneraleForm from '@/components/GeneraleForm'
import { Stack, Typography } from '@mui/material'


const Generale = () => {
  return (
    <>
       <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Configuration Generale</Typography>
          
        </Stack>
        {/* <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={handleAddClick}>
            Nouveau
          </Button>
        </div> */}
      </Stack>
      <div>
      <GeneraleForm />
    </div>
    </>
  )
}

export default Generale
