const db = require("../../../../models");
const {deleteImg} = require("../../../cloudinary");


const routes = {


create: async (req, res) => {
  const { position, imgDesktop, imgTablet, imgMobile, link, altText, sortOrder, isActive } = req.body;

  // Collect all uploaded images to clean up if needed
  const uploadedImages = [imgDesktop, imgTablet, imgMobile].filter(Boolean);

  // Check required field
  if (!imgDesktop) {
    // Delete all uploaded images if desktop is missing
    await Promise.all(uploadedImages.map(async (key) => {
      try {
        await deleteImg(key); // <-- your existing image deletion helper
      } catch (err) {
        console.error(`Failed to delete image ${key}:`, err.message);
      }
    }));
    return res.status(400).json({ mess: "imgDesktop is required" });
  }

  try {
    const banner = await db.Banner.create({
      position,
      imgDesktop,
      imgTablet,
      imgMobile,
      link,
      altText,
      sortOrder,
      isActive,
    });

    return res.status(200).json({
      mess: "Banner created successfully",
      success: true,
      data: banner,
    });
  } catch (err) {
    console.error("Error creating banner:", err);

    // Cleanup all uploaded images if DB create fails
    await Promise.all(uploadedImages.map(async (key) => {
      try {
        await deleteImg(key);
      } catch (imgErr) {
        console.error(`Cleanup failed for image ${key}:`, imgErr.message);
      }
    }));

    return res.status(500).json({ mess: err.message || "Server error" });
  }
},

list: async (req, res) => {
  try {
    const banners = await db.Banner.findAll({
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
    });

    return res.status(200).json({ success: true, data: banners });
  } catch (err) {
    console.error("Error fetching banners:", err);
    return res.status(500).json({ mess: "Server error", success: false });
  }
},

getById: async (req, res) => {
  const {id}=req.query;
  try {
    const banners = await db.Banner.findByPk(id);

    return res.status(200).json({ success: true, data: banners });
  } catch (err) {
    console.error("Error fetching banners:", err);
    return res.status(500).json({ mess: "Server error", success: false });
  }
},

delete: async (req, res) => {
  const { id } = req.query;

  try {
    const banner = await db.Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ mess: "Banner not found", success: false });
    }

    // Collect all image keys
    const imageKeys = [banner.imgDesktop, banner.imgTablet, banner.imgMobile].filter(Boolean);

    // Delete images
    await Promise.all(imageKeys.map(async (key) => {
      try {
        await deleteImg(key);
      } catch (imgErr) {
        console.error(`Failed to delete image ${key}:`, imgErr.message);
      }
    }));

    // Delete banner record
    await banner.destroy();

    return res.status(200).json({ mess: "Banner deleted successfully", success: true });
  } catch (err) {
    console.error("Error deleting banner:", err);
    return res.status(500).json({ mess: "Server error", success: false });
  }
}
,
update: async (req, res) => {
  const { id } = req.query;
  const {
    position, imgDesktop, imgTablet, imgMobile, link,
    altText, sortOrder, isActive
  } = req.body;

  try {
    const banner = await db.Banner.findByPk(id);
    if (!banner) {
      return res.status(404).json({ mess: "Banner not found", success: false });
    }

    // Store old image keys
    // const oldImages = {
    //   imgDesktop: banner.imgDesktop,
    //   imgTablet: banner.imgTablet,
    //   imgMobile: banner.imgMobile,
    // };

    // Check if new image was provided — delete old one if yes
    // const deletePromises = [];

    // if (imgDesktop && imgDesktop !== oldImages.imgDesktop) {
    //   deletePromises.push(deleteImg(oldImages.imgDesktop));
    // }

    // if (imgTablet && imgTablet !== oldImages.imgTablet) {
    //   deletePromises.push(deleteImg(oldImages.imgTablet));
    // }

    // if (imgMobile && imgMobile !== oldImages.imgMobile) {
    //   deletePromises.push(deleteImg(oldImages.imgMobile));
    // }

    await banner.update({
      position,
      imgDesktop,
      imgTablet,
      imgMobile,
      link,
      altText,
      sortOrder,
      isActive,
    });

    // await Promise.all(deletePromises); // 🧹 Clean up replaced images

    return res.status(200).json({ success: true, mess: "Banner updated successfully" });
  } catch (err) {
    console.error("Error updating banner:", err);
    return res.status(500).json({ mess: "Server error", success: false });
  }
},

 getBannerByPosition :async (req, res) => {

  try {
    const {position}=req.query;
    if(!position){
    return res.status(400).json({mess:"positon is provide"})
    }
    const banners = await db.Banner.findAll({
      where: { position: position,isActive:true },order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
    });
    res.json({data:banners});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banners' });
    console.log(error)
    return
  }
},

}

module.exports = routes;
