import { Route, Routes } from "react-router-dom";
import Create from "./create";
import List from "./list";
import { Component } from "react";
import UpdateBanner from './update'
class Banner extends Component {
    
    render() {
        return (
            <div>

                <Routes>
                    <Route path='/add/*' element={<Create />} />
                    <Route path='/update/:id*' element={<UpdateBanner />} />
                
                    <Route path='/*' element={<List />} />
                </Routes>

            </div>
        );
    }
}

export { Banner};
