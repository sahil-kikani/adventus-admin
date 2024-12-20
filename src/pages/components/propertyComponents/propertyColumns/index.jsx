import React from 'react'
import { Star, StarBorder } from '@mui/icons-material'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'

import Axios from 'src/Axios'
import Icon from 'src/@core/components/icon'
import Image from 'next/image'
import { useRouter } from 'next/router'

const RowOptions = ({ id, refetch }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const router = useRouter()

  const { mutate: deleteProperty } = useMutation({
    mutationFn: id => Axios.delete(`backend/property/${id}`),
    onSuccess: () => {
      setAnchorEl(null)
      toast.success('Property deleted successfully')
      refetch()
    },
    onError: err => {
      console.log('err', err)
    }
  })

  const handleRowOptionsClick = event => {
    setAnchorEl(event?.currentTarget)
  }

  const handleDelete = () => {
    deleteProperty(id)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => router.push(`/properties/edit/${id}`)}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

export default function PropertyColumn(refetch) {
  return [
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'NAME',
      field: 'name',
      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              fontWeight: 500,
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            <Image src={row?.images[0]} height={40} width={40} style={{ borderRadius: '50%', marginRight: '5px' }} />{' '}
            {row?.name || '-'}
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'CATEGORY',
      field: 'category.name',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row?.category?.name || 'N/A'}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'FOR TYPE',
      field: 'for_type',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row.for_type || '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'PRICE',
      field: 'price',
      renderCell: ({ row }) => {
        // Format the price with rupee symbol and commas
        const formattedPrice = row?.price ? `₹ ${row.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : '—'
        return <div>{formattedPrice}</div>
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'LOCATION',
      field: 'location',
      renderCell: ({ row }) => {
        return <div>{row?.location}</div>
      }
    },
    // {
    //   flex: 0.15,
    //   minWidth: 120,
    //   sortable: false,
    //   headerName: 'AREA',
    //   field: 'area',
    //   renderCell: ({ row }) => {
    //     return (
    //       <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
    //         {row?.area || 'N/A'}
    //       </Typography>
    //     )
    //   }
    // },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'AREA',
      field: 'area',
      renderCell: ({ row }) => {
        return (
          <div>
            {row?.ratings} <StarBorder className='mt-2' />
          </div>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions id={row.id} refetch={refetch} />
    }
  ]
}
