const yup = require("yup");
const categoryModel = require("../models/category");
const validate = async(req, res, next) => {
   try {
    console.log(req.body);
    const schema = yup.object().shape({
        title: yup.string().required(),
        description: yup.string().required(),
    });
    const { parent} = req.body;
    if(parent.length>1){
        const checkIfCategoryParentExist = await categoryModel.findById(parent);
        if (checkIfCategoryParentExist) {
        throw new Error("Category parent does not exist!");
        }
    }
    await schema.validate(req.body);
    next();
   } catch (error) {
    res.json({error:error.message});
    console.log(error.message);

   }
}
module.exports = validate;