import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { useState, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

import Axios from 'src/Axios'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddCategory from '../components/categoryComponents/addCategory'
import PropertyColumn from '../components/propertyComponents/propertyColumns'

const Property = () => {
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
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

  const toggleAddCategoryDrawer = () => {
    setAddUserOpen(!addUserOpen)
  }

  const { data, refetch } = useQuery({
    queryKey: ['get-property', value],
    queryFn: () => Axios.get(value === '' ? `backend/property?q` : `backend/property?search=${value}`),
    select: d => d?.data?.data
  })

  const mappedData = data?.map(row => ({ ...row, id: row._id })) || []

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            addTitle={'Add new Property'}
            toggle={toggleAddCategoryDrawer}
            handleFilter={handleFilter}
            addLink={'/properties/add'}
            title={'Property List'}
            searchTitle={'Search Property'}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={mappedData || []}
            columns={PropertyColumn(refetch)}
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

export default Property
