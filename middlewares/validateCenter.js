const yup = require("yup");
const categoryModel = require("../models/category");
const validate = async(req, res, next) => {
   try {
    console.log(req.body);
    const schema = yup.object().shape({
        title: yup.string().required().min(3),
        description: yup.string().required().min(100),
        longitude:yup.number().min(100),
        altitude:yup.number().min(100),
        phone:yup.number().min(10000000).max(99999999),
        location: yup.string().required().min(10),
        email:yup.string().email()
    });
    const { category } = req.body;
    const checkIfCategoryExist = await categoryModel.findById(category);
    if (isEmptyObject(checkIfCategoryExist)) {
        throw new Error("Category does not exist!");
    }
    await schema.validate(req.body);
    next();
   } catch (error) {
    res.json({error:error.message});
    console.log(error.message);
   }
}
module.exports = validate;