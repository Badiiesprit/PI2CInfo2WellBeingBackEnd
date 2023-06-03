const yup = require("yup");
const categoryModel = require("../models/category");
const validate = async(req, res, next) => {
   try {
    console.log(req.body);
    const schema = yup.object().shape({
        title: yup.string().required(),
        description: yup.string().required(),
        longitude:yup.number().min(10000000).max(99999999),
        altitude:yup.number().min(10000000).max(99999999),
        phone:yup.number().min(10000000).max(99999999),
        location: yup.string().required(),
        email:yup.string().email()
    });
    const { category } = req.body;
    const checkIfCategoryExist = await categoryModel.findById(category);
    if (!checkIfCategoryExist) {
        throw new Error("Category does not exist!");
    }
    await schema.validate(req.body);
    next();
   } catch (error) {
    res.json(error.message);
    console.log(error.message);
   }
}
module.exports = validate;