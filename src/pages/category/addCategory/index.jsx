import * as yup from 'yup'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CustomTextField from 'src/@core/components/mui/text-field'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Axios from 'src/Axios'
import toast from 'react-hot-toast'

const schema = yup.object().shape({
  name: yup.string().required('Category name is required'),
  image: yup.string().required('Image is required')
})

const AddCategory = props => {
  const { refetch, open, toggle, data, mode } = props // Receive props: data and mode
  console.log('data', data)
  const [preview, setPreview] = useState(null)

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      image: ''
    },
    resolver: yupResolver(schema)
  })

  // Populate fields for Edit or View modes
  useEffect(() => {
    if (data && (mode === 'edit' || mode === 'view')) {
      setValue('name', data.name || '')
      setValue('image', data.image || '')
      setPreview(data.image || '')
    } else {
      reset() // Clear fields for Add mode
      setPreview(null)
    }
  }, [data, mode, setValue, reset])

  const { mutate: addCategory } = useMutation({
    mutationFn: data => Axios.post('backend/category', data),
    onSuccess: () => {
      toast.success('Category add successfully')
      refetch()
      toggle()
    },
    onError: err => {
      console.log('err', err)
    }
  })

  const { mutate: editCategory } = useMutation({
    mutationFn: d => Axios.put(`backend/category/${data.id}`, d),
    onSuccess: () => {
      toast.success('Category updated successfully')
      refetch()
      toggle()
    },
    onError: err => {
      console.log('err', err)
    }
  })

  const onSubmit = formData => {
    console.log('Submitted Data:', formData)
    if (mode === 'edit') {
      editCategory(formData)
    } else {
      addCategory(formData)
    }
    // Submit handler here
  }

  const handleImageUpload = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        setValue('image', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Drawer open={open} anchor='right' onClose={toggle}>
      <Box p={4}>
        <Typography variant='h5' mb={2}>
          {mode === 'view' ? 'View Category' : mode === 'edit' ? 'Edit Category' : 'Add Category'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Category Name */}
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                label='Category Name'
                placeholder='Enter Category Name'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* Image Upload */}
          {/* Dropzone with Preview */}
          <Box
            sx={{
              mt: 4,
              mb: 4,
              border: '2px dashed #ccc',
              borderRadius: '8px',
              p: 4,
              textAlign: 'center',
              position: 'relative',
              cursor: mode === 'view' ? 'not-allowed' : 'pointer',
              backgroundColor: '#fafafa'
            }}
          >
            <input
              type='file'
              accept='image/*'
              id='upload-image'
              onChange={handleImageUpload}
              disabled={mode === 'view'}
              style={{
                opacity: 0,
                position: 'absolute',
                width: '100%',
                height: '100%',
                cursor: mode === 'view' ? 'not-allowed' : 'pointer'
              }}
            />
            {!preview ? (
              <></>
            ) : (
              <img
                src={preview}
                alt='Preview'
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
              />
            )}
            <Typography variant='body2' sx={{ color: '#777' }}>
              {mode === 'view' ? 'No file upload allowed in view mode' : 'Drop files here or click to upload.'}
            </Typography>
            <Typography variant='caption' sx={{ color: '#999' }}>
              Allowed *.jpeg, *.jpg, *.png, *.gif
            </Typography>
          </Box>

          {/* Action Buttons */}
          {mode !== 'view' && (
            <Box display='flex' gap={2}>
              <Button type='submit' variant='contained' color='primary'>
                {mode === 'edit' ? 'Update' : 'Submit'}
              </Button>
              <Button variant='outlined' color='secondary' onClick={toggle}>
                Cancel
              </Button>
            </Box>
          )}
        </form>
      </Box>
    </Drawer>
  )
}

export default AddCategory
