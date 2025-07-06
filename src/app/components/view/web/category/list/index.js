import React, { Component } from 'react'
import { categoryApi } from '../../../../services/categoryApi';
import styles from './index.module.scss'
import { RiDeleteBinLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';
import swal from 'sweetalert';
import {formatDate} from '../../../../services/formatDate';


export class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
    }
  }

 async getCategoryList() {
  this.setState({ loading: true });

  try {
    const result = await categoryApi.listAllCategory();
    if (result?.data) {
    console.log(result?.data)
      this.setState({ list: result.data });
    } else {
      this.setState({ list: [] });
      console.warn("No data received from API.");
    }
  } catch (error) {
    console.error("Error fetching category list:", error);
    // Optionally set an error message in state
  } finally {
    this.setState({ loading: false });
  }
}


//  deleteCategory = (id) => {
//   swal({
//     title: "Are you sure?",
//     text: "Are you sure that you want to delete this category?",
//     icon: "warning",
//     dangerMode: true,
//   }).then(async (willDelete) => {
//     if (!willDelete) return;

//     this.setState({ loading: true });

//     try {
//       const result = await categoryApi.deleteChildCategory({ id });
//       if (result) {
//         NotificationManager.info(result.data);
//         this.getCategoryList();
//       }
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       NotificationManager.error("Failed to delete category");
//     } finally {
//       this.setState({ loading: false });
//     }
//   });
// }


  componentDidMount() {
    this.getCategoryList()
  }


  render() {
    const { list } = this.state;
    if (this.state.loading) {
      return <Loader />
    }
    return (
      <div className={styles.list}>

        <Link className={styles.pbtn} to={'/category/addCategory'}>
          <button className={styles.btn}>Add New</button>
        </Link>

        <div className={styles.list}>
          <h3>All  Categories</h3>
          <table>
            <thead>
              <th>Category</th>
              <th>SubCategory</th>
              <th>ChildCategory</th>
              <th>Date</th>
             {/* <th>Action</th>*/}
            </thead>
            <tbody>
  {list.map((data) => (
    <tr key={data.id}>
      <td>{data.category?.name}</td>
      <td>{data.name}</td>
      <td>
        {data.childCategories?.length > 0 ? (
          <ul className={styles.childList}>
            {data.childCategories.map((child, index) => (
              <li key={index}>{child.name}</li>
            ))}
          </ul>
        ) : (
          <em>No child categories</em>
        )}
      </td>
      <td>{formatDate(data.createdAt)}</td>
      {/*<td className={styles.actions}>
        <RiDeleteBinLine
          onClick={() => this.deleteCategory(data.id)}
          className={styles.deleteIcon}
        />
      </td>*/}
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    )
  }
}

export default List
