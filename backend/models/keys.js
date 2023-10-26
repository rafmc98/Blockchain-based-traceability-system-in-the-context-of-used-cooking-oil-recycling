const mongoose = require("mongoose");
const Joi = require("joi");

const keysSchema = new mongoose.Schema({
  email: {type: String, required: true, unique:true },
  publicKey: { type: String, required: true, unique: true },
  privateKey: { type: String, required: true, unique: true },
});

const Keys = mongoose.model("Keys", keysSchema);

const validateKeys = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email"),
    publicKey: Joi.string().required().label("Public Key"),
    privateKey: Joi.string().required().label("Private Key"),
  });
  return schema.validate(data);
};

module.exports = { Keys, validateKeys };