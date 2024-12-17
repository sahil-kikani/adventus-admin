import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { useState, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

import Axios from 'src/Axios'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import ReviewColumn from '../components/reviewComponents/reviewColumns'
import AddReview from '../components/reviewComponents/addReview'

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
      setDrawerData(null)
      toggleAddCategoryDrawer()
    } else if (id) {
      try {
        const response = await Axios.get(`backend/review/${id}`)
        const categoryData = response?.data?.data
        if (categoryData) {
          setDrawerData({
            name: categoryData.name,
            designation: categoryData.designation,
            reviews: categoryData.reviews,
            stars: categoryData.stars,
            id: id
          })
          setDrawerMode(type)
          toggleAddCategoryDrawer()
        }
      } catch (error) {
        console.error('Error fetching review:', error)
      }
    }
  }

  const { data, refetch } = useQuery({
    queryKey: ['get-category', value],
    queryFn: () => Axios.get(value === '' ? `backend/review?q` : `backend/review?search=${value}`),
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
            addTitle={'Add new Review'}
            toggle={toggleAddCategoryDrawer}
            handleFilter={handleFilter}
            title={'Review List'}
            searchTitle={'Search Review'}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={mappedData || []}
            columns={ReviewColumn(refetch, handleCRUD)}
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

      <AddReview
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
