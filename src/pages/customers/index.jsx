import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import Axios from 'src/Axios'
import CustomersColumns from './customerColumns'
import TableHeader from 'src/views/apps/user/list/TableHeader'

const Customers = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [value, setValue] = useState('')

  const { data, refetch } = useQuery({
    queryKey: ['get-customers'],
    queryFn: () => Axios.get(`/backend/customer?q`),
    select: d => d?.data?.data
  })

  const handleSearch = useCallback(val => {
    setValue(val)
  }, [])

  const mappedData = data?.map(row => ({ ...row, id: row._id })) || []
  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleSearch}
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
