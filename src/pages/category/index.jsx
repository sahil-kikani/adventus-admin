import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'

import Axios from 'src/Axios'
import CategoryColumns from './categoryColumns'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddCategory from './addCategory'

const Category = () => {
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('') // 'view' or 'edit'
  const [drawerData, setDrawerData] = useState(null) // Data for the drawer form
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddCategoryDrawer = () => {
    setAddUserOpen(!addUserOpen)
  }
  // CRUD handler to set the mode and fetch data if needed
  const handleCRUD = async (type, id = null) => {
    if (type === 'add') {
      setDrawerMode('add')
      setDrawerData(null)
      toggleAddCategoryDrawer()
    } else if (id) {
      try {
        const response = await Axios.get(`backend/category/${id}`)
        const categoryData = response?.data?.data
        console.log('categoryData', categoryData)
        if (categoryData) {
          setDrawerData({
            name: categoryData.name,
            image: categoryData.image,
            id: id
          })
          setDrawerMode(type) // 'view' or 'edit'
          toggleAddCategoryDrawer()
        }
      } catch (error) {
        console.error('Error fetching category:', error)
      }
    }
  }

  const { data, refetch } = useQuery({
    queryKey: ['get-category'],
    queryFn: () => Axios.get(`backend/category?q`),
    select: d => d?.data?.data
  })

  const mappedData = data?.map(row => ({ ...row, id: row._id })) || []
  console.log(drawerData, 'drawerData')
  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            addTitle={'Add new Category'}
            toggle={toggleAddCategoryDrawer}
            handleFilter={handleFilter}
            title={'Category List'}
            searchTitle={'Search Category'}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={mappedData || []}
            columns={CategoryColumns(refetch, handleCRUD)}
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
