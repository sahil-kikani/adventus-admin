import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import { useState, useCallback, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

import Axios from 'src/Axios'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import TeamsColumn from '../components/teamsComponents/teamColumns'
import AddTeam from '../components/teamsComponents/addTeam'

const Teams = () => {
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
        const response = await Axios.get(`backend/team/${id}`)
        const categoryData = response?.data?.data
        if (categoryData) {
          setDrawerData({
            name: categoryData.name,
            description: categoryData.description,
            photo: categoryData.photo,
            id: id
          })
          setDrawerMode(type)
          toggleAddCategoryDrawer()
        }
      } catch (error) {
        console.error('Error fetching team:', error)
      }
    }
  }

  const { data, refetch } = useQuery({
    queryKey: ['get-team', value],
    queryFn: () => Axios.get(value === '' ? `backend/team?q` : `backend/team?search=${value}`),
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
            addTitle={'Add new Team'}
            toggle={toggleAddCategoryDrawer}
            handleFilter={handleFilter}
            title={'Team List'}
            searchTitle={'Search Team'}
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

      <AddTeam
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
