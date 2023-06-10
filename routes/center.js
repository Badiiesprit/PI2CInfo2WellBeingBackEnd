var express = require('express');
const centerModel = require("../models/center");
const categoryModel = require("../models/category");
const validateToken = require("../middlewares/validateToken");
const validate = require("../middlewares/validateCenter");
const uploadAndSaveImage = require("../middlewares/uploadAndSaveImage");
var router = express.Router();
const axios = require('axios');

async function getIPInformation(ipAddress) {
  const apiKey = '6e22eb552a2d686b831d72bed3d22e8f'; // Replace with your actual API key
  const url = `http://api.ipstack.com/${ipAddress}?access_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch IP information');
  }
}


/**
 * @swagger
 * tags:
 *   name: Centre
 *   description: API pour les opérations liées aux centre
 */


router.post("/add" , validate , uploadAndSaveImage , async (req, res, next) => {
    try {
      const {title , description , longitude , altitude , location , phone , email , category} = req.body;
      
      const categoryData = {
        title,
        description,
        longitude , 
        altitude , 
        location , 
        phone , 
        email ,
        category
      };
      if (req.body.imageIds) {
        categoryData.image = req.body.imageIds;
      }
      const center = new centerModel(categoryData);
      center.save();
      res.json({ result: center });
    } catch (error) {
      res.json({error : error.message});
    }
  }
);

router.post("/update/:id",validateToken,validate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {title , description , longitude , altitude , location , phone , email , category} = req.body;
   
    const categoryData = {};

      if (title) {
        categoryData.title = title;
      }
      if (description) {
        categoryData.description = description;
      }
      if (longitude) {
        categoryData.longitude = longitude;
      }
      if (altitude) {
        categoryData.altitude = altitude;
      }
      if (location) {
        categoryData.location = location;
      }
      if (phone) {
        categoryData.phone = phone;
      }
      if (email) {
        categoryData.email = email;
      }
      if (category) {
        categoryData.category = category;
      }
    if (req.body.imageIds) {
      categoryData.image = req.body.imageIds;
    }
    await centerModel.findByIdAndUpdate(id, categoryData);
    center = await centerModel.findById(id);
    res.json({ result: center });
  } catch (error) {
    res.json({error : error.message});
  }
});

/**
 * @swagger
 * /center/delete/{id}:
 *   delete:
 *     summary: Supprime un centre par son ID
 *     tags: [Center]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du centre à supprimer
 *     responses:
 *       200:
 *         description: Succès
 */
router.delete("/delete/:id",validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    await centerModel.findByIdAndUpdate(id, {disable:true});
    const center = await centerModel.findById(id);
    res.json({ result: center });
  } catch (error) {
    res.json({error : error.message});
  }
});

/**
 * @swagger
 * /center/getbyip/{ipAddress}:
 *   get:
 *     summary: Récupère un centre par adresse IP
 *     tags: [Center]
 *     parameters:
 *       - in: path
 *         name: ipAddress
 *         schema:
 *           type: string
 *         required: true
 *         description: Adresse IP du centre à récupérer
 *     responses:
 *       200:
 *         description: Succès
 */
router.get('/getbyip/:ipAddress', async (req, res, next) => {

  //const ipAddress = req.clientIp; // Replace with the IP address you want to look up
  const {ipAddress} = req.params;
  console.log(ipAddress);
  await getIPInformation(ipAddress).then((data) => {
    console.log(data);
    res.json({data});
  }).catch((error) => {
    console.error(error);
    res.json({error : error.message});
  });
  res.send("welcome to center");
});

/**
 * @swagger
 * /center/get/{id}:
 *   get:
 *     summary: Récupère un centre par son ID
 *     tags: [Center]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du centre à récupérer
 *     responses:
 *       200:
 *         description: Succès
 */
router.get("/get/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const center = await centerModel.findById(id).populate('image').populate('category');
    if(center){
      center.nbVus = center.nbVus + 1;
      await centerModel.findByIdAndUpdate(id, {nbVus:(center.nbVus)});
    }
    res.json({ result: center });
  } catch (error) {
    res.json({error : error.message});
  }
});

/**
 * @swagger
 * /center/get:
 *   get:
 *     summary: Récupère la liste des centres
 *     tags: [Center]
 *     responses:
 *       200:
 *         description: Succès
 */

router.get("/get", async (req, res, next) => {
  try {
    const centers = await centerModel.find().populate('image').populate('category');
    res.json({ size: centers.length, result: centers });
  } catch (error) {
    res.json({error : error.message});
  }
});

/**
 * @swagger
 * /center/search:
 *   get:
 *     summary: Recherche un centre par titre ou description
 *     tags: [Center]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Mot clé de recherche
 *     responses:
 *       200:
 *         description: Succès
 */

router.get("/search", async (req, res, next) => {
  try {
    const { search } = req.body;
    console.log(search);
    if (!search) {
      centers = await centerModel.find().populate('image').populate('category');
    } else {
      const searchQuery = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ]
      };
      centers = await centerModel.find(searchQuery).populate('image').populate('category');
    }
    res.json({ size: centers.length, result: centers });
  } catch (error) {
    res.json({error : error.message});
  }
});

/**
 * @swagger
 * /center/getbycategory/{category}:
 *   get:
 *     summary: Récupère les centres par catégorie
 *     tags: [Center]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Succès
 */
router.get("/getbycategory/:category", async (req, res, next) => {
  try {
    const { category } = req.params;
    const centers = await centerModel.find({category}).populate('image').populate('category');
    res.json({ size: centers.length, result: centers });
  } catch (error) {
    res.json({error : error.message});
  }
});

/**
 * @swagger
 * /center/gettopvus/{limit}:
 *   get:
 *     summary: Récupère les centres les plus vus
 *     tags: [Center]
 *     parameters:
 *       - in: path
 *         name: limit
 *         schema:
 *           type: integer
 *         required: true
 *         description: Nombre maximum de centres à récupérer
 *     responses:
 *       200:
 *         description: Succès
 */
router.get("/gettopvus/:limit", async (req, res, next) => {
  try {
    const { limit } = req.params;
    const centers = await centerModel.find()
      .sort({ nbVus: -1 })
      .limit(limit)
      .populate('image')
      .populate('category');
    res.json({ size: centers.length, result: centers });
  } catch (error) {
    res.json({error : error.message});
  }
});

/**
 * @swagger
 * /center/page:
 *   get:
 *     summary: Récupère une page de centres paginée
 *     tags: [Center]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numéro de la page à récupérer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: true
 *         description: Taille de la page (nombre de centres par page)
 *     responses:
 *       200:
 *         description: Succès
 */
router.get("/page", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page (default: 1)
    const pageSize = parseInt(req.query.pageSize) || 10; // Page size (default: 10)

    const totalCenters = await centerModel.countDocuments();
    const totalPages = Math.ceil(totalCenters / pageSize);

    const centers = await centerModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    res.json({ centers, totalPages, currentPage: page });
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;

