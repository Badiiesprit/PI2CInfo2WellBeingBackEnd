const yup = require("yup");
const categoryModel = require("../models/category");
var express = require('express');


const validate = async(req, res, next) => {
   try {
    const schema = yup.object().shape({
        title: yup.string().required().min(3),
        description: yup.string().required().min(100),
    });
    const { parent , title } = req.body;
    if(parent && parent.length>1){
        const checkIfCategoryParentExist = await categoryModel.findById(parent);
        if (isEmptyObject(checkIfCategoryParentExist)) {
            throw new Error("Category parent does not exist!");
        }
    }
    const checkIfCategoryExist = await categoryModel.findOne({ title });
    if (!isEmptyObject(checkIfCategoryExist)) {
        throw new Error("Category already exist!");
    }
    await schema.validate(req.body);
    next();
   } catch (error) {
    res.json({error:error.message});
    console.log(error.message);

   }
}
module.exports = validate;