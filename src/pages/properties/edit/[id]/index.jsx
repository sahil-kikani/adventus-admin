import { useRouter } from 'next/router'
import React from 'react'
import AddProperty from 'src/pages/components/propertyComponents/addEditProperty'

function page() {
  const { query: routerQuery } = useRouter()
  const propertyId = routerQuery?.id

  return <AddProperty mode='edit' id={propertyId} />
}

export default page
