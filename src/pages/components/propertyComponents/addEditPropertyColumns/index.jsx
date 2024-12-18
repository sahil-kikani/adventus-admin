import { Box, Button, Drawer, Typography, Select, MenuItem, InputLabel } from '@mui/material'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import React, { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import Axios from 'src/Axios'
import CustomTextField from 'src/@core/components/mui/text-field'
import UseBgColor from 'src/@core/hooks/useBgColor'

const GOOGLE_MAPS_API_KEY = 'AIzaSyAyp3zTF3CykyPGiQv5FzY3-kKWZnYbq08 '

const schema = yup.object().shape({
  name: yup.string().required('Property name is required'),
  location: yup.string().required('Location is required'),
  price: yup.number().positive().required('Price is required'),
  monthlyPrice: yup.number().positive().required('Monthly price is required'),
  area: yup.number().positive().required('Area is required'),
  bedrooms: yup.number().positive().integer().required('Bedrooms is required'),
  bathrooms: yup.number().positive().integer().required('Bathrooms is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().required('Property type is required'),
  furnishingStatus: yup.string().required('Furnishing status is required'),
  purpose: yup.string().required('Purpose is required')
})

const AddProperty = ({ refetch, open, toggle, data, mode }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  })
  const [center, setCenter] = useState({ lat: 25.2048, lng: 55.2708 }) // Default to Dubai
  const [marker, setMarker] = useState(null)
  const bgColors = UseBgColor()
  const [images, setImages] = useState([''])

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
      location: '',
      price: 0,
      monthlyPrice: 0,
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      category: '',
      type: '',
      furnishingStatus: '',
      purpose: ''
    },
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (data && (mode === 'edit' || mode === 'view')) {
      setValue('name', data.name || '')
      setValue('location', data.location || '')
      setValue('price', data.price || 0)
      setValue('monthlyPrice', data.monthlyPrice || 0)
      setValue('area', data.area || 0)
      setValue('bedrooms', data.bedrooms || 0)
      setValue('bathrooms', data.bathrooms || 0)
      setValue('category', data.category || '')
      setValue('type', data.type || '')
      setValue('furnishingStatus', data.furnishingStatus || '')
      setValue('purpose', data.purpose || '')
      setCenter({ lat: data.latitude, lng: data.longitude })
      setMarker({ lat: data.latitude, lng: data.longitude })
    } else {
      reset()
      setCenter({ lat: 25.2048, lng: 55.2708 })
      setMarker(null)
    }
  }, [data, mode, setValue, reset])

  const { mutate: addProperty } = useMutation({
    mutationFn: data => Axios.post('backend/property', data),
    onSuccess: () => {
      toast.success('Property added successfully')
      refetch()
      reset()
      handleToggle()
    },
    onError: err => {
      console.log('err', err)
    }
  })

  const { mutate: editProperty } = useMutation({
    mutationFn: d => Axios.put(`backend/property/${data.id}`, d),
    onSuccess: () => {
      toast.success('Property updated successfully')
      refetch()
      reset()
      handleToggle()
    },
    onError: err => {
      console.log('err', err)
    }
  })

  const onSubmit = formData => {
    const propertyData = {
      ...formData,
      latitude: marker?.lat,
      longitude: marker?.lng
    }
    if (mode === 'edit') {
      editProperty(propertyData)
    } else {
      addProperty(propertyData)
    }
  }

  const handleMapClick = event => {
    setMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() })
    setValue('location', `${event.latLng.lat()}, ${event.latLng.lng()}`)
  }

  function handleToggle() {
    clearErrors()
    toggle()
  }

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result
      const newImages = [...images]
      newImages[index] = base64
      setImages(newImages)
    }
    reader.readAsDataURL(file)
  }

  const handleAddImage = () => {
    setImages([...images, ''])
  }

  const handleRemoveImage = index => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
  }

  return (
    <>
      <Typography variant='h5' p={2} mb={2} sx={{ backgroundColor: bgColors.primaryLight.backgroundColor }}>
        {mode === 'view' ? 'View Property' : mode === 'edit' ? 'Edit Property' : 'Add Property'}
      </Typography>
      <Box p={4}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                placeholder='Enter Property Name'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* Map */}
          {isLoaded && (
            <Box mt={4}>
              <GoogleMap
                mapContainerStyle={{ height: '300px', width: '100%' }}
                center={center}
                zoom={12}
                onClick={handleMapClick}
              >
                {marker && <Marker position={marker} />}
              </GoogleMap>
            </Box>
          )}

          <Controller
            name='price'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                type='number'
                placeholder='Enter Price'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />

          <Controller
            name='monthlyPrice'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                type='number'
                placeholder='Enter Monthly Price'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.monthlyPrice}
                helperText={errors.monthlyPrice?.message}
              />
            )}
          />

          <Controller
            name='area'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                type='number'
                placeholder='Enter Area'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.area}
                helperText={errors.area?.message}
              />
            )}
          />

          <Controller
            name='bedrooms'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                type='number'
                placeholder='Enter Bedrooms'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.bedrooms}
                helperText={errors.bedrooms?.message}
              />
            )}
          />

          <Controller
            name='bathrooms'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                type='number'
                placeholder='Enter Bathrooms'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.bathrooms}
                helperText={errors.bathrooms?.message}
              />
            )}
          />

          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <Box>
                <InputLabel id='category-label'>Category</InputLabel>
                <Select
                  fullWidth
                  labelId='category-label'
                  {...field}
                  disabled={mode === 'view'}
                  error={!!errors.category}
                >
                  <MenuItem value=''>Select Category</MenuItem>
                  <MenuItem value='residential'>Residential</MenuItem>
                  <MenuItem value='commercial'>Commercial</MenuItem>
                  <MenuItem value='industrial'>Industrial</MenuItem>
                </Select>
                {errors.category && (
                  <Typography variant='body2' color='error'>
                    {errors.category?.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <Box>
                <InputLabel id='type-label'>Property Type</InputLabel>
                <Select fullWidth labelId='type-label' {...field} disabled={mode === 'view'} error={!!errors.type}>
                  <MenuItem value=''>Select Type</MenuItem>
                  <MenuItem value='apartment'>Apartment</MenuItem>
                  <MenuItem value='house'>House</MenuItem>
                  <MenuItem value='villa'>Villa</MenuItem>
                  <MenuItem value='office'>Office</MenuItem>
                  <MenuItem value='retail'>Retail</MenuItem>
                </Select>
                {errors.type && (
                  <Typography variant='body2' color='error'>
                    {errors.type?.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Controller
            name='furnishingStatus'
            control={control}
            render={({ field }) => (
              <Box>
                <InputLabel id='furnishing-status-label'>Furnishing Status</InputLabel>
                <Select
                  fullWidth
                  labelId='furnishing-status-label'
                  {...field}
                  disabled={mode === 'view'}
                  error={!!errors.furnishingStatus}
                >
                  <MenuItem value=''>Select Furnishing Status</MenuItem>
                  <MenuItem value='furnished'>Furnished</MenuItem>
                  <MenuItem value='unfurnished'>Unfurnished</MenuItem>
                  <MenuItem value='partly-furnished'>Partly Furnished</MenuItem>
                </Select>
                {errors.furnishingStatus && (
                  <Typography variant='body2' color='error'>
                    {errors.furnishingStatus?.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          <Controller
            name='purpose'
            control={control}
            render={({ field }) => (
              <Box>
                <InputLabel id='purpose-label'>Purpose</InputLabel>
                <Select
                  fullWidth
                  labelId='purpose-label'
                  {...field}
                  disabled={mode === 'view'}
                  error={!!errors.purpose}
                >
                  <MenuItem value=''>Select Purpose</MenuItem>
                  <MenuItem value='sale'>Sale</MenuItem>
                  <MenuItem value='rent'>Rent</MenuItem>
                </Select>
                {errors.purpose && (
                  <Typography variant='body2' color='error'>
                    {errors.purpose?.message}
                  </Typography>
                )}
              </Box>
            )}
          />

          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                borderRadius: '8px',
                p: 4,
                minHeight: '200px',
                textAlign: 'center',
                position: 'relative',
                cursor: mode === 'view' ? 'not-allowed' : 'pointer',
                backgroundColor: bgColors.primaryLight.backgroundColor,
                mb: 2
              }}
            >
              <input
                type='file'
                accept='image/*'
                id={`upload-image-${index}`}
                onChange={e => handleImageUpload(index, e)}
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
              {images.length > 1 && (
                <IconButton
                  onClick={() => handleRemoveImage(index)}
                  disabled={mode === 'view'}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <Remove />
                </IconButton>
              )}
            </Box>
          ))}
          <Button type='button' onClick={handleAddImage} disabled={mode === 'view'} startIcon={<Add />}>
            Add Image
          </Button>

          {mode !== 'view' && (
            <Box display='flex' gap={2} mt={4}>
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
    </>
  )
}

export default AddProperty
