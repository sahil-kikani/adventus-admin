import * as yup from 'yup'
import { Box } from '@mui/system'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

import Axios from 'src/Axios'
import CustomTextField from 'src/@core/components/mui/text-field'

const schema = yup.object().shape({
  name: yup.string().required('Category name is required'),
  designation: yup.string().required('Designation is required'),
  reviews: yup.string().required('Review is required'),
  stars: yup.number().required('Stars are required').min(0, 'Stars must be at least 0').max(5, 'Stars cannot exceed 5'),
  image: yup.string().required('Image is required')
})

const AddReview = props => {
  const { refetch, open, toggle, data, mode } = props

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      designation: '',
      reviews: '',
      stars: ''
    },
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (data && (mode === 'edit' || mode === 'view')) {
      setValue('name', data.name || '')
      setValue('designation', data.designation || '')
      setValue('reviews', data.reviews || '')
      setValue('stars', data.stars || '')
    } else {
      reset()
    }
  }, [data, mode, setValue, reset])

  const { mutate: addReview } = useMutation({
    mutationFn: data => Axios.post('backend/review', data),
    onSuccess: () => {
      toast.success('Category added successfully')
      refetch()
      toggle()
    },
    onError: err => {
      console.log('Error:', err)
    }
  })

  const { mutate: editReview } = useMutation({
    mutationFn: d => Axios.put(`backend/review/${data.id}`, d),
    onSuccess: () => {
      toast.success('Category updated successfully')
      refetch()
      toggle()
    },
    onError: err => {
      console.log('Error:', err)
    }
  })

  const onSubmit = formData => {
    if (mode === 'edit') {
      editReview(formData)
    } else {
      addReview(formData)
    }
  }

  return (
    <Drawer open={open} anchor='right' onClose={toggle} sx={{ '& .MuiDrawer-paper': { width: '400px' } }}>
      <Box p={4}>
        <Typography variant='h5' mb={2}>
          {mode === 'view' ? 'View Review' : mode === 'edit' ? 'Edit Review' : 'Add Review'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

          <Controller
            name='designation'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                placeholder='Enter Designation'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.designation}
                helperText={errors.designation?.message}
              />
            )}
          />

          <Controller
            name='reviews'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                placeholder='Enter Review'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.reviews}
                helperText={errors.reviews?.message}
              />
            )}
          />

          <Controller
            name='stars'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                type='number'
                placeholder='Enter Stars (0-5)'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.stars}
                helperText={errors.stars?.message}
              />
            )}
          />

          {mode !== 'view' && (
            <Box display='flex' sx={{ marginTop: '8px' }} gap={2}>
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

export default AddReview
