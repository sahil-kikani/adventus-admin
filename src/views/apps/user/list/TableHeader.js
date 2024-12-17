import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { CardHeader } from '@mui/material'
import Link from 'next/link'

const TableHeader = props => {
  const { handleFilter, value, title, searchTitle, addTitle, addLink, toggle, handleCRUD } = props

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <CardHeader title={title} sx={{ padding: '0px' }} />
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          // value={value}
          sx={{ mr: 4 }}
          placeholder={searchTitle}
          onChange={e => handleFilter(e.target.value)}
        />

        {addLink && (
          <Link href={addLink}>
            <Button variant='contained' sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              {addTitle}
            </Button>
          </Link>
        )}

        {toggle && (
          <Button onClick={() => handleCRUD('add', null)} variant='contained' sx={{ '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            {addTitle}
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default TableHeader
