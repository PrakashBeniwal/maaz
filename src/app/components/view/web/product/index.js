import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Create from './create'
import List from './list'
import AddImage from './morePhoto'
import Edit from './edit'

const Product = () => {
  return (
    <div>
         <Routes>
            <Route path='/addProduct' element={<Create/>} />
            <Route path='/editProduct/:id' element={<Edit/>} />
            <Route path='/*' element={<List/>} />
            <Route path='/add-more-image' element={<AddImage/>} />
        </Routes>
    </div>
  )
}

export { Product}
