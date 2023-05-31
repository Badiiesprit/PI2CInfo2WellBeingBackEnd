const yup = require("yup");
const validate = async(req, res, next) => {
   try {
    console.log(req.body);
    const schema = yup.object().shape({
        fullname : yup.string().max(9),
        email : yup.string().email(),
        telephone : yup.number(), // .max(9)
    });
    await schema.validate(req.body);
    next();
   } catch (error) {
    res.render("error", { message: error.message, error });
   }
}
module.exports = validate;