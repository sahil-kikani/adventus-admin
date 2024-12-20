import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { useState, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

import Axios from 'src/Axios'
import ContactInquiryColumns from './contactInquiryColumns'
import TableHeader from 'src/views/apps/user/list/TableHeader'

const ContactInquiry = () => {
  const [value, setValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const debounceTimeout = useRef(null)

  const handleFilter = useCallback(val => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    debounceTimeout.current = setTimeout(() => {
      setValue(val)
    }, 1000)
  }, [])

  const { data, refetch } = useQuery({
    queryKey: ['get-contact-inquiry', value],
    queryFn: () => Axios.get(value === '' ? `backend/contact-inquiry?q` : `backend/contact-inquiry?search=${value}`),
    select: d => d?.data?.data
  })

  const mappedData = data?.map(row => ({ ...row, id: row._id })) || []

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            title={'Contact Inquiry List'}
            searchTitle={'Search Contact Inquiry'}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={mappedData || []}
            columns={ContactInquiryColumns(refetch)}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableColumnMenu
            sortingOrder={[]}
            disableDensitySelector
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ContactInquiry
