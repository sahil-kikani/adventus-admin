import { Box, Button, Typography, Select, MenuItem, IconButton, Grid, TextField } from '@mui/material'
import { GoogleMap, Marker, Autocomplete, LoadScript } from '@react-google-maps/api'
import React, { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import Axios from 'src/Axios'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { Remove } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
// import { defaultValueProperty, propertySchema } from './propertySchema'

const GOOGLE_MAPS_API_KEY = 'AIzaSyAyp3zTF3CykyPGiQv5FzY3-kKWZnYbq08 '

const schema = yup.object().shape({
  name: yup.string().required('Property name is required'),
  price: yup.number().positive().required('Price is required'),
  monthly_price: yup.number().positive().required('Monthly price is required'),
  area: yup.string().required('Area is required'),
  beds: yup.number().positive().integer().required('Bedrooms is required'),
  baths: yup.number().positive().integer().required('Bathrooms is required'),
  category: yup.string().required('Category is required'),
  for_type: yup.string().required('Property type is required'),
  ratings: yup.string().required('ratings is required'),
  reviews: yup
    .number()
    .required('reviews are required')
    .min(0, 'reviews must be at least 0')
    .max(5, 'reviews cannot exceed 5')
})

const AddProperty = ({ mode, id }) => {
  const bgColors = UseBgColor()
  const theme = useTheme()
  const [center, setCenter] = useState({ lat: 23.0225, lng: 72.5714 })
  const [marker, setMarker] = useState({ lat: 23.0225, lng: 72.5714 })
  const [autocomplete, setAutocomplete] = useState(null)
  const [images, setImages] = useState([''])
  const [searchInput, setSearchInput] = useState('')
  const router = useRouter()

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
      price: null,
      monthly_price: null,
      area: null,
      beds: null,
      baths: null,
      category: '',
      for_type: '',
      description: '',
      ratings: '',
      reviews: 0
    },
    resolver: yupResolver(schema)
  })

  const { data: getData } = useQuery({
    queryKey: ['property', id],
    select: d => d?.data?.data,
    queryFn: () => Axios.get(`backend/property/${id}`),
    enabled: mode === 'edit'
  })

  useEffect(() => {
    if (getData && mode === 'edit') {
      setValue('name', getData.name || '')
      setValue('location', getData.location || '')
      setSearchInput(getData.location)
      setValue('price', getData.price || 0)
      setValue('monthly_price', getData.monthly_price || 0)
      setValue('area', getData.area || 0)
      setValue('beds', getData.beds || 0)
      setValue('baths', getData.baths || 0)
      setValue('category', getData.category._id || '')
      setValue('for_type', getData.for_type || '')
      setValue('description', getData.description)
      setValue('ratings', getData.ratings || '')
      setValue('reviews', getData.reviews || '')
      setImages(getData.images)
      setCenter({ lat: Number(getData.latitude), lng: Number(getData.longitude) })
      setMarker({ lat: Number(getData.latitude), lng: Number(getData.longitude) })
    }
  }, [getData, mode, setValue, reset])

  // !Add Property API
  const { mutate: addProperty } = useMutation({
    mutationFn: data => Axios.post('backend/property', data),
    onSuccess: () => {
      toast.success('Property added successfully')
      router.push('/properties')
    },
    onError: err => {
      console.log('err', err)
    }
  })

  // !Edit Property API
  const { mutate: editProperty } = useMutation({
    mutationFn: d => Axios.put(`backend/property/${id}`, d),
    onSuccess: () => {
      toast.success('Property updated successfully')
      router.push('/properties')
    },
    onError: err => {
      console.log('err', err)
    }
  })

  // !Get Categories API
  const { data: categories } = useQuery({
    queryFn: () => Axios.get('backend/category?q')
  })

  // !Data Submit
  const onSubmit = formData => {
    const propertyData = {
      ...formData,
      images: images,
      location: searchInput,
      latitude: (marker?.lat).toString(),
      longitude: (marker?.lng).toString()
    }
    if (mode === 'edit') {
      editProperty(propertyData)
    } else {
      addProperty(propertyData)
    }
  }

  // !Set Map location
  const handleMapClick = event => {
    setMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() })
    setValue('location', `${event.latLng.lat()}, ${event.latLng.lng()}`)
  }

  // !Image Upload
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

  // !Add Image
  const handleAddImage = () => {
    setImages([...images, ''])
  }

  // !Remove Image
  const handleRemoveImage = index => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
  }

  // !Google Map Search
  const onLoad = autoCompleteInstance => {
    setAutocomplete(autoCompleteInstance)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      setSearchInput(place.formatted_address)
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      })
      setMarker({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      })
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }

  const handleSearchInputChange = e => {
    setSearchInput(e.target.value)
  }

  return (
    <>
      <Typography variant='h5' p={2} mb={2}>
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

          <Box mt={4}>
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <CustomTextField
                  fullWidth
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  placeholder={'Search Location'}
                  type='text'
                  InputProps={{
                    style: {
                      marginBottom: '10px'
                    }
                  }}
                />
              </Autocomplete>
              <GoogleMap
                mapContainerStyle={{ height: '500px', width: '100%' }}
                center={center}
                zoom={12}
                onClick={handleMapClick}
              >
                {marker && <Marker position={marker} />}
              </GoogleMap>
            </LoadScript>
          </Box>

          <Grid container spacing={2} mt={4}>
            {/* First Row: Price and Monthly Price */}
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='monthly_price'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    placeholder='Enter Monthly Price'
                    {...field}
                    disabled={mode === 'view'}
                    error={!!errors.monthly_price}
                    helperText={errors.monthly_price?.message}
                  />
                )}
              />
            </Grid>

            {/* Second Row: Area and Bedrooms */}
            <Grid item xs={12} md={6}>
              <Controller
                name='area'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    type='text'
                    placeholder='Enter Area'
                    {...field}
                    disabled={mode === 'view'}
                    error={!!errors.area}
                    helperText={errors.area?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='beds'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    placeholder='Enter Bedrooms'
                    {...field}
                    disabled={mode === 'view'}
                    error={!!errors.beds}
                    helperText={errors.beds?.message}
                  />
                )}
              />
            </Grid>

            {/* third row */}
            <Grid item xs={12} md={6}>
              <Controller
                name='baths'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    style={{ marginTop: '5px', marginBottom: '5px' }}
                    placeholder='Enter Bathrooms'
                    {...field}
                    disabled={mode === 'view'}
                    error={!!errors.baths}
                    helperText={errors.baths?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name='reviews'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    placeholder='Enter Reviews (0-5)'
                    {...field}
                    disabled={mode === 'reviews'}
                    error={!!errors.reviews}
                    helperText={errors.reviews?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {/* Type Select */}
            <Grid item xs={12} md={6}>
              <Controller
                name='for_type'
                control={control}
                render={({ field }) => (
                  <Select fullWidth displayEmpty {...field} disabled={mode === 'view'} error={!!errors.for_type}>
                    <MenuItem value='' disabled>
                      Select Type
                    </MenuItem>
                    <MenuItem value='rent'>Rent</MenuItem>
                    <MenuItem value='sale'>Sell</MenuItem>
                  </Select>
                )}
              />
              {errors.for_type && (
                <Typography variant='body2' color='error'>
                  {errors.for_type?.message}
                </Typography>
              )}
            </Grid>

            {/* Category Select */}
            <Grid item xs={12} md={6}>
              <Controller
                name='category'
                control={control}
                render={({ field }) => (
                  <Select fullWidth displayEmpty {...field} disabled={mode === 'view'} error={!!errors.category}>
                    <MenuItem value='' disabled>
                      Select Category
                    </MenuItem>
                    {categories?.data?.data?.map(category => (
                      <MenuItem key={category.id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.category && (
                <Typography variant='body2' color='error'>
                  {errors.category?.message}
                </Typography>
              )}
            </Grid>

            {/* Description Field */}
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder='Enter Description'
                    {...field}
                    disabled={mode === 'view'}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            {/* ratings Field */}
            <Grid item xs={12}>
              <Controller
                name='ratings'
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder='Enter Ratings'
                    {...field}
                    disabled={mode === 'view'}
                    error={!!errors.ratings}
                    helperText={errors.ratings?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          {images?.map((image, index) => (
            <Box
              key={index}
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

              {image ? (
                <img
                  src={image}
                  alt='Preview'
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}
                />
              ) : (
                <Icon icon='tabler:file-upload' />
              )}
              <Typography variant='body2' sx={{ color: theme.palette.primary.main }}>
                {mode === 'view' ? 'No file upload allowed in view mode' : 'Drop files here or click to upload.'}
              </Typography>
              <Typography variant='caption' sx={{ color: '#999' }}>
                Allowed *.jpeg, *.jpg, *.png, *.gif
              </Typography>
            </Box>
          ))}
          <Button type='button' onClick={handleAddImage} disabled={mode === 'view'}>
            Add Image
          </Button>

          {mode !== 'view' && (
            <Box display='flex' gap={2} mt={4}>
              <Button type='submit' variant='contained' color='primary'>
                {mode === 'edit' ? 'Update' : 'Submit'}
              </Button>
              <Button variant='outlined' color='secondary' onClick={() => router.push('/properties')}>
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
