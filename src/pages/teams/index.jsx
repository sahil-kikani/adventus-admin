import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'

import Axios from 'src/Axios'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import ReviewColumn from '../components/reviewComponents/reviewColumns'
import AddReview from '../components/reviewComponents/addReview'
import TeamsColumn from '../components/teamsComponents/teamColumns'

const Teams = () => {
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState('')
  const [drawerData, setDrawerData] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const handleFilter = useCallback(val => {
    setValue(val)
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
        const response = await Axios.get(`backend/team/${id}`)
        const categoryData = response?.data?.data
        if (categoryData) {
          setDrawerData({
            name: categoryData.name,
            designation: categoryData.designation,
            photo: categoryData.photo,
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
    queryKey: ['get-team'],
    queryFn: () => Axios.get(`backend/team?q`),
    select: d => d?.data?.data
  })

  //   "name": "JOhn",
  //   "description": "Associates",
  //   "photo": "https://adventus-admin-api.pdwap.store/uploads/team/1733123682613-4wk95.png",
  //   "createdAt": "2024-11-29T16:31:40.520Z",
  //   "updatedAt": "2024-12-02T07:14:42.613Z",

  const mappedData = data?.map(row => ({ ...row, id: row._id })) || []

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
            columns={TeamsColumn(refetch, handleCRUD)}
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

export default Teams
