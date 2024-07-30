import ConfigOnglet from '@/components/ui/ConfigOnglet'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Configuration = () => {
  return (
    <>
      <div className="flex gap-5 min-h-[500px] rounded-lg">
        <div className="w-1/5 p-4 bg-blue-500 rounded-lg" > {/* Première colonne, occupe 20% */}
          <ConfigOnglet/>
        </div>
        <div className="w-4/5 p-4 bg-gray-400 rounded-lg"> {/* Deuxième colonne, occupe 80% */}
          <Outlet/>
        </div>
    </div>
    </>
  )
}

export default Configuration
