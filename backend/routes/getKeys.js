const router = require("express").Router();
const { Keys } = require("../models/keys");

router.post("/", async (req, res) => {
	try {
		const keyPair = await Keys.findOne({ email: req.body.email });
		if (!keyPair)
			return res.status(401).send({ message: "Email invalid" });

		const privateKey = keyPair.privateKey;
		const publicKey = keyPair.publicKey;
		
		res.status(200).send({ data: {publicKey, privateKey}, message: "Encryption keys got succesfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
	});
	return schema.validate(data);
};

module.exports = router;