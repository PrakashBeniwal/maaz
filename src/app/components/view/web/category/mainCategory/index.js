import React, { Component } from 'react'
import { categoryApi } from '../../../../services/categoryApi';
import CommonCategory from '../commonCategory';
import { NotificationManager } from 'react-notifications';
import swal from 'sweetalert';
import Loader from '../../../../../loading';
export class MainCategory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      name: "",
      slug: "",
      editName: "pk",
      editSlug: "slug",
      id: "",
      edit: false,
      loading:true
    }
  }

getCategoryList() {
  this.setState({ loading: true });

  categoryApi.listMainCategory()
    .then(result => {
      if (result) {
        this.setState({ list: result.data });
      }
    })
    .catch(error => {
      console.error("Error fetching categories:", error);
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}


  componentDidMount() {
    this.getCategoryList();
  }

 createCategory = async () => {
  this.setState({ loading: true });

  const { name, slug } = this.state;
  const data = { name, slug };

  try {
    const result = await categoryApi.createMainCategory(data);
    if (result) {
      this.getCategoryList();
      NotificationManager.success(result.data);
    }
  } catch (error) {
    console.error("Create category error:", error);
    NotificationManager.error("Failed to create category");
  } finally {
    this.setState({ loading: false });
  }
};

 updateCategory = async (id) => {
  this.setState({ loading: true });

  const { editName, editSlug } = this.state;
  const data = { name: editName, slug: editSlug, id };

  try {
    const result = await categoryApi.updateMainCategory(data);
    if (result) {
      this.getCategoryList();
      NotificationManager.info(result.data);
      this.setState({ edit: false });
    }
  } catch (error) {
    console.error("Update category error:", error);
    NotificationManager.error("Failed to update category");
  } finally {
    this.setState({ loading: false });
  }
};

  deleteCategory = (id) => {
  swal({
    title: "Are you sure?",
    text: "Are you sure that you want to delete this category?",
    icon: "warning",
    dangerMode: true,
  }).then(async (willDelete) => {
    if (!willDelete) return;

    this.setState({ loading: true });

    try {
      const result = await categoryApi.deleteMainCategory({ id });
      if (result) {
        this.getCategoryList();
        NotificationManager.success(result.data);
      }
    } catch (error) {
      console.error("Delete category error:", error);
      NotificationManager.error("Failed to delete category");
    } finally {
      this.setState({ loading: false });
    }
  });
};

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleInputEdit = (editName, editSlug) => {
    this.setState({
      editName, editSlug
    })

  }

  handleEdit = (data) => {
    this.setState({
      editName: data.name,
      editSlug: data.slug,
      id: data.id,
      edit: true
    })
    return;
  }

  cancel = () => {
    this.setState({
      edit: false
    })
  }

  render() {
   
    const { list, editName, editSlug, id, edit } = this.state;
    const data = { list, editName, editSlug, id, edit };
    const method = {
      createCategory: this.createCategory,
      updateCategory: this.updateCategory,
      deleteCategory: this.deleteCategory,
      handleInput: this.handleInput,
      handleInputEdit: this.handleInputEdit,
      handleEdit: this.handleEdit,
      cancel: this.cancel,
      category: "Category"
    }

     if (this.state.loading) {
     return <Loader />
    }
    return (
      <div>
        <CommonCategory data={data} method={method} />
      </div>
    )
  }
}

export default MainCategory
