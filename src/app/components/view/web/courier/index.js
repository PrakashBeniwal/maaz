import React, { Component } from 'react'
import { Route, Routes } from 'react-router-dom'
import CourierPricing from './courierPricing'
import Courier from './createCourier'


export class CourierComp extends Component {
  render() {
    return (
      <div>
        <Routes>
            <Route path='/courierPricing/*' element={<CourierPricing/>} />
            <Route path='/' element={<Courier/>} />
            
        </Routes>
      </div>
    )
  }
}

export default CourierComp
