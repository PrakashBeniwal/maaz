import React, { Component } from 'react'
import { categoryApi } from '../../../../services/categoryApi';
import CommonCategory from '../commonCategory';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';
import swal from 'sweetalert';

export class SubCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      MainList: [],
      name: "",
      slug: "",
      categoryId: "",
      editName: "pk",
      editSlug: "slug",
      id: "",
      edit: false
    }
  }

async getCategoryList() {
  this.setState({ loading: true });

  try {
    const result = await categoryApi.listSubCategory();
    if (result?.data) {
      this.setState({ list: result.data });
    }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
  } finally {
    this.setState({ loading: false });
  }
}

async getMainCategoryList() {
  this.setState({ loading: true });

  try {
    const result = await categoryApi.listMainCategory();
    if (result?.data) {
      this.setState({ MainList: result.data });
    }
  } catch (error) {
    console.error("Error fetching main categories:", error);
  } finally {
    this.setState({ loading: false });
  }
}


  componentDidMount() {
    this.getCategoryList();
    this.getMainCategoryList();
  }

createCategory = async () => {
  this.setState({ loading: true });

  const { name, slug, categoryId } = this.state;
  const data = { name, slug, categoryId };

  try {
    const result = await categoryApi.createSubCategory(data);
    if (result) {
      this.getCategoryList();
      NotificationManager.success(result.data);
    }
  } catch (error) {
    console.error("Error creating subcategory:", error);
    NotificationManager.error("Failed to create subcategory.");
  } finally {
    this.setState({ loading: false });
  }
};

 updateCategory = async (id) => {
  this.setState({ loading: true });

  const { editName, editSlug } = this.state;
  const data = { name: editName, slug: editSlug, id };

  try {
    const result = await categoryApi.updateSubCategory(data);
    if (result) {
      NotificationManager.success(result.data);
      this.setState({ edit: false });
      this.getCategoryList();
    }
  } catch (error) {
    console.error("Error updating subcategory:", error);
    NotificationManager.error("Failed to update subcategory.");
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
      const result = await categoryApi.deleteSubCategory({ id });
      if (result) {
        this.getCategoryList();
        NotificationManager.success(result.data);
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      NotificationManager.error("Failed to delete subcategory.");
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

  onSelectMainCategory = (e) => {
    this.setState({ categoryId: e.value })
  }

  onSelectSubCategory = (e) => {
    this.setState({ categoryId: e.value })
  }



  render() {
    if (this.state.loading) {
      return <Loader />
    }
    const { list, editName, editSlug, id, edit, MainList } = this.state;
    const data = { list, editName, editSlug, id, edit, MainList };
    const method = {
      createCategory: this.createCategory,
      updateCategory: this.updateCategory,
      deleteCategory: this.deleteCategory,
      handleInput: this.handleInput,
      handleInputEdit: this.handleInputEdit,
      handleEdit: this.handleEdit,
      cancel: this.cancel,
      onSelectMainCategory: this.onSelectMainCategory,
      onSelectSubCategory: this.onSelectSubCategory,
      category: "subCategory"
    }
    return (
      <div>
        <CommonCategory data={data} method={method} />
      </div>
    )
  }
}

export default SubCategory
