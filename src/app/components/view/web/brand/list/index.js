import React, { Component } from 'react';
import styles from './index.module.scss';
import { BiSolidEdit } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { brandApi } from '../../../../services/brandApi';
import Edit from './edit';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';
import {formatDate} from '../../../../services/formatDate';
class List extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            list:[],
            name:"",
            slug:"",
            id:null,
            edit:false
         }
    }

    cancel=()=>{
      this.setState({edit:false});
    }
    
   findstate = () => {
  this.setState({ loading: true });
  brandApi.list()
    .then(data => {
      if (data) {
        this.setState({ list: data.list });
      }
    })
    .catch(err => {
      console.error("Failed to fetch brand list:", err);
      NotificationManager.error("Failed to fetch brand list");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}

handleDelete = (id) => {
  this.setState({ loading: true });
  brandApi.delete(id)
    .then(success => {
      if (success) {
        NotificationManager.success(success.mess);
        this.findstate();
      }
    })
    .catch(err => {
      console.error("Delete failed:", err);
      NotificationManager.error("Failed to delete brand");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}

handleEdit = (id) => {
  this.setState({ loading: true });
  const { name, slug } = this.state;
  const data = { name, slug, id };

  brandApi.update(data)
    .then(success => {
      if (success) {
        NotificationManager.success(success.mess);
        this.setState({ edit: false });
        this.findstate();
      }
    })
    .catch(err => {
      console.error("Update failed:", err);
      NotificationManager.error("Failed to update brand");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}



 componentDidMount() { 
       this.findstate();
    }
    
    handleChange=(e)=>{
      this.setState({[e.target.name]:e.target.value})
    }

    handleUpdate=(data)=>{
      this.setState({
        name:data.name,
        slug:data.slug,
        id:data.id,
        edit:true
      })
    }

    render() { 
      const{cancel,handleEdit,handleDelete,handleChange,handleUpdate}=this;
      const {list,edit,name,slug,id}=this.state;
      
      if (this.state.loading) {
      return <Loader />
    }
        return ( 
            <div>
          <div className={styles.list}>
            <h3>All  Brands</h3>
            <table>
              <thead>
                <th>Name</th>
                <th>Slug</th>
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
                        <td>{formatDate(data.createdAt)}</td>
                        <td className="pointer">
                          <BiSolidEdit onClick={() => {handleUpdate(data) }} />
                          <RiDeleteBinLine onClick={() => {handleDelete(data.id) }} />
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          {edit &&
          <Edit cancel={cancel} id={id} editName={name} editSlug={slug}  setState={handleChange} update={handleEdit} />
        }
            </div>
         );
    }
}
 
export default List;
