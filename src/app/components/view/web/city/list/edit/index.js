import React, { Component } from 'react'
import styles from "./index.module.scss"
import Select from 'react-select'
export class Edit extends Component {
  options=[
    {
        "label":"Active","value":"1"
    },
    {
        "label":"InActive","value":"0"
    },
]
  render() {
  
    return (
      <div>
        <div className={styles.popupbg} onClick={this.props.cancel}/>
        <div className={styles.update}>
          <h3>Update Category</h3>
          <label htmlFor="">Name*</label>
          <input type="text" name='name' value={this.props.editName} onChange={(e)=>{this.props.setState(e)}} />
          {/* <div> */}
            <label htmlFor="">Status*</label>
            <Select options={this.options} defaultInputValue={this.props.editStatus?"Active":"Inactive"} onChange={(e)=>{this.props.handleStatus(e)}} />
            {/* </div> */}
          <div>
          <button onClick={()=>this.props.update(this.props.id)}>Save Changes</button>
          <button className={styles.cancel} onClick={()=>this.props.cancel()}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Edit