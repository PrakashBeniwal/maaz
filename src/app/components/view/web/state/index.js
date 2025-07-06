import { Route, Routes } from "react-router-dom";
import Create from "./create";
import List from "./list";
import { Component } from "react";

class State extends Component {
    
    render() {
        return (
            <div>

                <Routes>
                    <Route path='/add-state/*' element={<Create />} />
                    <Route path='/*' element={<List />} />
                </Routes>

            </div>
        );
    }
}

export { State};
