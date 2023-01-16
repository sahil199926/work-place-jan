import { Skeleton } from '@mui/material'
import React from 'react'

function Loadingprofile({fields}) {
  let list =[...Array(fields).keys()]

  return (
    <div style={{
      maxWidth: '800px',
      margin:' 50px auto'
    }}>
    {
      list.map((item=>{
        return (<Skeleton
          sx={{
            margin: '10px auto',
            maxWidth: '90%',
          }}
          height={50}
          animation="wave" />)
      }))
    }
    </div>
    
  
  )
}

export default Loadingprofile