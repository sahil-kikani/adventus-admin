import {
  Box,
  Button,
  Drawer,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Grid,
  TextField
} from '@mui/material'
import { GoogleMap, useJsApiLoader, Marker, Autocomplete, LoadScript } from '@react-google-maps/api'
import React, { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import Axios from 'src/Axios'
import CustomTextField from 'src/@core/components/mui/text-field'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { Remove } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

const GOOGLE_MAPS_API_KEY = 'AIzaSyAyp3zTF3CykyPGiQv5FzY3-kKWZnYbq08 '

const schema = yup.object().shape({
  name: yup.string().required('Property name is required'),
  price: yup.number().positive().required('Price is required'),
  monthlyPrice: yup.number().positive().required('Monthly price is required'),
  area: yup.number().positive().required('Area is required'),
  bedrooms: yup.number().positive().integer().required('Bedrooms is required'),
  bathrooms: yup.number().positive().integer().required('Bathrooms is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().required('Property type is required')
})

const AddProperty = ({ refetch, open, toggle, data, mode }) => {
  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: GOOGLE_MAPS_API_KEY
  // })

  // const { isLoaded: placeLoader } = useJsApiLoader({
  //   libraries: ['places'],
  //   googleMapsApiKey: GOOGLE_MAPS_API_KEY
  // })
  const [center, setCenter] = useState({ lat: 23.0225, lng: 72.5714 })
  const [marker, setMarker] = useState({ lat: 23.0225, lng: 72.5714 })
  const bgColors = UseBgColor()
  const [images, setImages] = useState([''])
  const theme = useTheme()
  const [searchInput, setSearchInput] = useState('')

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
      monthlyPrice: null,
      area: null,
      bedrooms: null,
      bathrooms: null,
      category: '',
      type: ''
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
      setCenter({ lat: 23.0225, lng: 72.5714 })
      setMarker({ lat: 23.0225, lng: 72.5714 })
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
      images: images,
      latitude: marker?.lat,
      longitude: marker?.lng
    }
    console.log(propertyData, 'propertyData')
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

  const { data: categories } = useQuery({
    queryFn: () => Axios.get('backend/category?q')
  })

  const [autocomplete, setAutocomplete] = useState(null)

  const onLoad = autoCompleteInstance => {
    setAutocomplete(autoCompleteInstance)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
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
              {/* Your component JSX */}
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                  type='text'
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  placeholder='Search location'
                />
              </Autocomplete>
              <GoogleMap
                mapContainerStyle={{ height: '300px', width: '100%' }}
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
            </Grid>

            {/* Second Row: Area and Bedrooms */}
            <Grid item xs={12} md={6}>
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
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>
          </Grid>

          <Controller
            name='bathrooms'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                type='number'
                style={{ marginTop: '5px', marginBottom: '5px' }}
                placeholder='Enter Bathrooms'
                {...field}
                disabled={mode === 'view'}
                error={!!errors.bathrooms}
                helperText={errors.bathrooms?.message}
              />
            )}
          />

          <Grid container spacing={2}>
            {/* Type Select */}
            <Grid item xs={12} md={6}>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <Select fullWidth displayEmpty {...field} disabled={mode === 'view'} error={!!errors.type}>
                    <MenuItem value='' disabled>
                      Select Type
                    </MenuItem>
                    <MenuItem value='rent'>Rent</MenuItem>
                    <MenuItem value='sell'>Sell</MenuItem>
                  </Select>
                )}
              />
              {errors.type && (
                <Typography variant='body2' color='error'>
                  {errors.type?.message}
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
                      <MenuItem key={category.id} value={category.name}>
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
          </Grid>

          {images.map((image, index) => (
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
