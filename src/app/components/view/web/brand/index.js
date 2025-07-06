import { Route, Routes } from "react-router-dom";
import Create from "./create";
import List from "./list";
import { Component } from "react";

class Brand extends Component {
    
    render() {
        return (
            <div>

                <Routes>
                    <Route path='/add-brand/*' element={<Create />} />
                    <Route path='/*' element={<List />} />
                </Routes>

            </div>
        );
    }
}

export { Brand};
