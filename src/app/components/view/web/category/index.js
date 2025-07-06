import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainCategory from './mainCategory'
import ChildCategory from './childCategory'
import SubCategory from './subCategory'
import List from './list'

export class Category extends Component {
  render() {
    return (
      <div>
        <Routes>
            <Route path='/addcategory/*' element={<MainCategory/>} />
            <Route path='/addsubCategory/*' element={<SubCategory/>} />
            <Route path='/addchildCategory/*' element={<ChildCategory/>} />
            <Route path='/*' element={<List/>} />
        </Routes>
      </div>
    )
  }
}

export default Category
