import { routes } from "../../../config";
import { Axios } from "../axios";
import { error } from "../error";

const categoryApi={

    ///Main category
    createMainCategory:(data)=>{
      let result=  Axios.post(routes.createMainCategory,data)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    updateMainCategory:(data)=>{
      let result=  Axios.post(routes.updateMainCategory,data)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    deleteMainCategory:(data)=>{
      let result=  Axios.post(routes.deleteMainCategory,data)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    listMainCategory:()=>{
      let result=  Axios.get(routes.MainCategoryList)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },


    ///Sub category
    createSubCategory:(data)=>{
      let result=  Axios.post(routes.createSubCategory,data)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    updateSubCategory:(data)=>{
      let result=  Axios.post(routes.updateSubCategory,data)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    deleteSubCategory:(data)=>{
      let result=  Axios.post(routes.deleteSubCategory,data)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    listSubCategory:()=>{
      let result=  Axios.get(routes.subCategoryList)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },


    ///Child category

    createChildCategory:(data)=>{
      let result=  Axios.post(routes.createChildCategory,data)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    updateChildCategory:(data)=>{
      let result=  Axios.post(routes.updateChildCategory,data)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    deleteChildCategory:(data)=>{
      let result=  Axios.post(routes.deleteChildCategory,data)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    listChildCategory:()=>{
      let result=  Axios.get(routes.ChildCategoryList)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    
 listAllCategory:()=>{
      let result=  Axios.get(routes.listAllCategory)
        .then(result=>{
            if (result) {
                return result.data;
            }
            return null;
        }).catch(err=>{
            error(err);
            return
        })

        return result;
    },
    // category by id

    subListById:(data)=>{
        let result=  Axios.post(routes.subCategoryListById,data)
          .then(result=>{
              if (result) {
                  return result.data;
              }
              return null;
          }).catch(err=>{
              error(err);
              return
          })
  
          return result;
      },

    childListById:(data)=>{
        let result=  Axios.post(routes.childCategoryListById,data)
          .then(result=>{
              if (result) {
                  return result.data;
              }
              return null;
          }).catch(err=>{
              error(err);
              return
          })
  
          return result;
      },
}

export {categoryApi};
