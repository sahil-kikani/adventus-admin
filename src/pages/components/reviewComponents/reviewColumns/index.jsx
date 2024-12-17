import React from 'react'
import { Star, StarBorder } from '@mui/icons-material'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'

import Axios from 'src/Axios'
import Icon from 'src/@core/components/icon'

const RowOptions = ({ id, refetch, handleCRUD }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const { mutate: deleteCustomer } = useMutation({
    mutationFn: id => Axios.delete(`backend/review/${id}`),
    onSuccess: () => {
      setAnchorEl(null)
      toast.success('review deleted successfully')
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
    deleteCustomer(id)
  }

  const handleEdit = type => {
    setAnchorEl(false)
    handleCRUD(type, id)
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
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleEdit('view')}>
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => handleEdit('edit')}>
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

export default function ReviewColumn(refetch, handleCRUD) {
  return [
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'NAME',
      field: 'name',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row.name || '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'NAME',
      field: 'designation',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row.designation || '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'NAME',
      field: 'reviews',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row.reviews || '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'STARS',
      field: 'stars',
      renderCell: ({ row }) => {
        return (
          <div>
            {[...Array(5)].map((_, index) => (index < row.stars ? <Star key={index} /> : <StarBorder key={index} />))}
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
      renderCell: ({ row }) => <RowOptions id={row.id} refetch={refetch} handleCRUD={handleCRUD} />
    }
  ]
}
