import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { styled } from '@mui/system'

const DropZone = styled(Box)(({ theme }) => ({
  border: '2px dashed #ccc',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#aaa'
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}))

const AddEditViewCategory = () => {
  const { handleSubmit, control, register, setValue } = useForm()
  const [preview, setPreview] = useState(null)

  const onSubmit = data => {
    console.log('Form Data:', data)
  }

  const handleImageUpload = e => {
    const file = e.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setValue('image', file) // Set file in react-hook-form
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, margin: 'auto' }}>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Add Category
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Category Name */}
        <Box sx={{ mb: 2 }}>
          <TextField
            label='Category Name'
            variant='outlined'
            fullWidth
            {...register('categoryName', { required: 'Category name is required' })}
          />
        </Box>

        {/* Drop Zone for Upload Image */}
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1 }}>Upload Image</Typography>
          <Controller
            name='image'
            control={control}
            rules={{ required: 'Image is required' }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <>
                <DropZone>
                  <input
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    id='upload-image'
                    onChange={e => {
                      handleImageUpload(e)
                      onChange(e.target.files[0]) // Update the form value
                    }}
                  />
                  <label htmlFor='upload-image'>
                    {preview ? (
                      <img src={preview} alt='Preview' style={{ maxWidth: '100%', maxHeight: '150px' }} />
                    ) : (
                      <Typography>Drop files here or click to upload</Typography>
                    )}
                  </label>
                </DropZone>
                {error && (
                  <Typography color='error' sx={{ mt: 1 }}>
                    {error.message}
                  </Typography>
                )}
              </>
            )}
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button type='submit' variant='contained' color='primary' fullWidth>
            Submit
          </Button>
          <Button type='reset' variant='outlined' color='secondary' fullWidth>
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default AddEditViewCategory
