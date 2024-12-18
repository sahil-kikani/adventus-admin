import * as yup from 'yup'
import { Box } from '@mui/system'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'

import Axios from 'src/Axios'
import CustomTextField from 'src/@core/components/mui/text-field'
import UseBgColor from 'src/@core/hooks/useBgColor'

const schema = yup.object().shape({
  name: yup.string().required('Category name is required'),
  image: yup.string().required('Image is required')
})

const AddCategory = props => {
  const { refetch, open, toggle, data, mode } = props
  const [preview, setPreview] = useState(null)
  const bgColors = UseBgColor()
  const theme = useTheme()

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      image: ''
    },
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (data && (mode === 'edit' || mode === 'view')) {
      setValue('name', data.name || '')
      setValue('image', data.image || '')
      setPreview(data.image || '')
    } else {
      reset()
      setPreview(null)
    }
  }, [data, mode, setValue, reset])

  const { mutate: addCategory } = useMutation({
    mutationFn: data => Axios.post('backend/category', data),
    onSuccess: () => {
      toast.success('Category add successfully')
      refetch()
      reset()
      handleToggle()
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
      reset()
      handleToggle()
    },
    onError: err => {
      console.log('err', err)
    }
  })

  const onSubmit = formData => {
    if (mode === 'edit') {
      const newData = data?.image === formData.image ? { name: formData?.name } : formData
      editCategory(newData)
    } else {
      addCategory(formData)
    }
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

  function handleToggle() {
    clearErrors()
    toggle()
  }

  return (
    <Drawer open={open} anchor='right' onClose={handleToggle} sx={{ '& .MuiDrawer-paper': { width: '400px' } }}>
      <Typography variant='h5' p={2} mb={2} sx={{ backgroundColor: bgColors.primaryLight.backgroundColor }}>
        {mode === 'view' ? 'View Category' : mode === 'edit' ? 'Edit Category' : 'Add Category'}
      </Typography>
      <Box p={4}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                placeholder='Enter Category Name'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Box
            sx={{
              mt: 4,
              mb: 4,
              border: '2px dashed #ccc',
              borderRadius: '8px',
              p: 4,
              minHeight: '200px',
              textAlign: 'center',
              position: 'relative',
              cursor: mode === 'view' ? 'not-allowed' : 'pointer',
              backgroundColor: bgColors.primaryLight.backgroundColor
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
                left: 0,
                position: 'absolute',
                width: '100%',
                height: '100%',
                cursor: mode === 'view' ? 'not-allowed' : 'pointer'
              }}
            />

            {!preview ? (
              <>
                <Icon icon='tabler:file-upload' />
              </>
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
            {errors?.image && (
              <Typography variant='body2' color='error'>
                {errors?.image?.message}
              </Typography>
            )}

            <Typography variant='body2' sx={{ color: theme.palette.primary.main }}>
              {mode === 'view' ? 'No file upload allowed in view mode' : 'Drop files here or click to upload.'}
            </Typography>
            <Typography variant='caption' sx={{ color: '#999' }}>
              Allowed *.jpeg, *.jpg, *.png, *.gif
            </Typography>
          </Box>

          {mode !== 'view' && (
            <Box display='flex' gap={2}>
              <Button type='submit' variant='contained' color='primary'>
                {mode === 'edit' ? 'Update' : 'Submit'}
              </Button>
              <Button variant='outlined' color='secondary' onClick={handleToggle}>
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
