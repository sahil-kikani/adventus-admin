import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useQuery } from '@tanstack/react-query'
import { useState, useCallback, useRef } from 'react'
import { DataGrid } from '@mui/x-data-grid'

import TableHeader from 'src/views/apps/user/list/TableHeader'
import Axios from 'src/Axios'
import BrokerColumns from './brokerColumn'

const Brokers = () => {
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
    queryKey: ['get-brokers', value],
    queryFn: () => Axios.get(value === '' ? `backend/broker?q` : `backend/broker?search=${value}`),
    select: d => d?.data?.data
  })

  const mappedData = data?.map(row => ({ ...row, id: row._id })) || []

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} title={'Broker List'} searchTitle={'Search Broker'} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={mappedData || []}
            columns={BrokerColumns(refetch)}
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

export default Brokers
