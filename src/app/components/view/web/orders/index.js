import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom'
import List from './list'
import OrderDetail from './view'
import OrderByStatus from './orderByStatus'
export class Orders extends Component {
  render() {
    return (
      <div>
        <Routes>
            <Route path='/' element={<List/>} />
            <Route path='/view' element={<OrderDetail/>} />
            <Route path='/orderByStatus/:status' element={<OrderByStatus/>} />
            
        </Routes>
      </div>
    )
  }
}

export default Orders
