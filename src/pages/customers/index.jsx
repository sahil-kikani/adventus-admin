import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { useCallback, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import Axios from 'src/Axios'
import CustomersColumns from './customerColumns'
import TableHeader from 'src/views/apps/user/list/TableHeader'

const Customers = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [value, setValue] = useState('')

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
    queryKey: ['get-customers', value],
    queryFn: () => Axios.get(value === '' ? `backend/customer?q` : `backend/customer?search=${value}`),
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
            title={'Customer List'}
            searchTitle={'Search Customer'}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={mappedData || []}
            columns={CustomersColumns(refetch)}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableColumnMenu
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default Customers
