import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { useState, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

import Axios from 'src/Axios'
import CategoryColumns from '../components/categoryComponents/categoryColumns'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddCategory from '../components/categoryComponents/addCategory'
import PropertyColumn from '../components/propertyComponents/propertyColumns'

const Category = () => {
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('')
  const [drawerData, setDrawerData] = useState(null)
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

  const handleCRUD = async (type, id = null) => {
    if (type === 'add') {
      setDrawerMode('add')
      toggleAddCategoryDrawer()
      setDrawerData(null)
    } else if (id) {
      try {
        const response = await Axios.get(`backend/category/${id}`)
        const categoryData = response?.data?.data
        if (categoryData) {
          setDrawerData({
            name: categoryData.name,
            image: categoryData.image,
            id: id
          })
          setDrawerMode(type)
          toggleAddCategoryDrawer()
        }
      } catch (error) {
        console.error('Error fetching category:', error)
      }
    }
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
            handleCRUD={handleCRUD}
            addTitle={'Add new Property'}
            toggle={toggleAddCategoryDrawer}
            handleFilter={handleFilter}
            title={'Property List'}
            searchTitle={'Search Property'}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={mappedData || []}
            columns={PropertyColumn(refetch, handleCRUD)}
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

      <AddCategory
        open={addUserOpen}
        refetch={refetch}
        toggle={toggleAddCategoryDrawer}
        data={drawerData}
        mode={drawerMode}
      />
    </Grid>
  )
}

export default Category
