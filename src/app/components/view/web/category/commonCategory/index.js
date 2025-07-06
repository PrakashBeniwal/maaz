import React, { Component } from 'react'
import Edit from './edit'
import styles from './index.module.scss'
import { BiSolidEdit } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
import Select from 'react-select';
import {formatDate} from '../../../../services/formatDate';

export class CommonCategory extends Component {

    Array=(data,label,value)=>{
        const arrayItems=[];
        if (data&&Array.isArray(data)) {
          data.map(items=>{
            return(
              arrayItems.push({label:items[label],value:items[value]})
            )
          })
        }
        return arrayItems;
      }

  render() {
    const { list, editName, editSlug, id, edit ,MainList,subList} = this.props.data;
   const { createCategory, updateCategory, deleteCategory, handleInput, category, handleEdit, cancel, onSelectMainCategory, onSelectSubCategory
      }=this.props.method
    return (
        <div className={styles.container} >
        <div className={styles.category}>
          <div className={styles.create}>
            <h3>Add Category</h3>
            <label htmlFor="">Name*</label>
            <input type="text" name="name" placeholder='Category name' onChange={(e) => { handleInput(e) }} />
            <label htmlFor="">Slug*</label>
            <input type="text" name="slug" placeholder='electronics' onChange={(e) => { handleInput(e) }} />
           { (category==="subCategory" || category=== "childCategory")&&
           <div>
           <label htmlFor="">MainCategory*</label>
            <Select options={this.Array(MainList,"name","id")} onChange={(e)=>{onSelectMainCategory(e)}} /></div>
            }

           { category==="childCategory"&&
           <div>
           <label htmlFor="">SubCategory*</label>
            <Select options={this.Array(subList,"name","id")} onChange={(e)=>{onSelectSubCategory(e)}} /></div>
            }
            <button className="submit" onClick={createCategory}>Add New</button>
          </div>

          <div className={styles.list}>
            <h3>All  Categories</h3>
            <table>
              <thead>
                <th>Name</th>
                <th>Slug</th>
                { (category==="subCategory" || category==="childCategory")&&<th>Category</th>}
                { (category==="childCategory")&&<th>subCategory</th>}
                <th>Date</th>
                <th>Action</th>
              </thead>
              <tbody>
                {
                  list.map(data => {
                    return (
                      <tr key={data.id}>
                        <td>{data.name}</td>
                        <td>{data.slug}</td>
                        {(category==="subCategory" ||category==="childCategory")&&<td>{data.category?.name}</td>}
                        {category==="childCategory"&&<td>{data.subCategory?.name}</td>}
                        <td>{formatDate(data.createdAt)}</td>
                        <td className="pointer">
                          <BiSolidEdit onClick={() => { handleEdit(data) }} />
                          <RiDeleteBinLine onClick={() => { deleteCategory(data.id) }} />
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>

        </div>
        {edit &&
          <Edit cancel={cancel} id={id} editName={editName} editSlug={editSlug} setState={handleInput} update={updateCategory} />
        }
      </div>
    )
  }
}

export default CommonCategory
