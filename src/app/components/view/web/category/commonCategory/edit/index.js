import React, { Component } from 'react'
import styles from "./index.module.scss"
export class Edit extends Component {

  render() {
  
    return (
      <div>
        <div className={styles.popupbg} onClick={this.props.cancel}/>
        <div className={styles.update}>
          <h3>Update Category</h3>
          <label htmlFor="">Name*</label>
          <input type="text" name='editName' value={this.props.editName} onChange={(e)=>{this.props.setState(e)}} />
          <label htmlFor="">Slug*</label>
          <input type="text" name='editSlug' value={this.props.editSlug} onChange={(e)=>{this.props.setState(e)}} />
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