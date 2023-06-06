const yup = require("yup");
const validate = async(req, res, next) => {
   try {
    console.log(req.body);
    const schema = yup.object().shape({

        name: yup.string().required(),
        description: yup.string().required(),
        location:yup.string().required(),

    });
    await schema.validate(req.body);
    next();
   } catch (error) {
    res.json(error.message);
    console.log(error.message);

   }
}
module.exports = validate;