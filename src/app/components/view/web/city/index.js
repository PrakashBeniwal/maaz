import { Route, Routes } from "react-router-dom";
import Create from "./create";
import List from "./list";
import { Component } from "react";

class City extends Component {
    render() {
        return (
            <div>

                <Routes>
                    <Route path='/add-city/*' element={<Create />} />
                    <Route path='/*' element={<List />} />
                </Routes>

            </div>
        );
    }
}

export { City};
