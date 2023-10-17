import { Box } from '@mui/material'
import React from 'react'
import { HELPER } from '../../services'

export default function ImgBoxShow({ src, sx = null }) {
  return (
    <>
        {!HELPER.isEmpty(src) && (
            <Box
                component="img"
                sx={{...(HELPER.isEmpty(sx) && {
                    height: 50,
                    width: 50,
                    maxHeight: { xs: 25, md: 50 },
                    maxWidth: { xs: 25, md: 50 },
                })}}
                src={HELPER.getImageUrl(src)}
            />
        )}
    </>
  )
}
