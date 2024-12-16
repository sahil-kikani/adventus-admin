import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'

import Axios from 'src/Axios'
import Icon from 'src/@core/components/icon'

const RowOptions = ({ id, refetch }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const { mutate: deleteCustomer } = useMutation({
    mutationFn: id => Axios.delete(`backend/financial-advisor/${id}`),
    onSuccess: () => {
      setAnchorEl(null)
      toast.success('financial advisor deleted successfully')
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
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

export default function FinancialAdvisorColumns(refetch) {
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
      headerName: 'EMAIL',
      field: 'email',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row.email || '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'MOBILE NO',
      field: 'phone',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row?.phone || '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'DOB',
      field: 'dob',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row?.dob || '-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      headerName: 'ADDRESS',
      field: 'address',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {row?.address || '-'}
          </Typography>
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