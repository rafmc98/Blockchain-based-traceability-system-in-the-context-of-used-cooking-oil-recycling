const router = require("express").Router();
const { Keys } = require("../models/keys");

router.post("/", async (req, res) => {
	try {
		const keyPair = await Keys.findOne({ email: req.body.email });
		if (!keyPair)
			return res.status(401).send({ message: "Email invalid" });

		const publicKey = keyPair.publicKey;
		const privateKey = keyPair.privateKey;
		
		res.status(200).send({ data: {publicKey, privateKey}, message: "Encryption keys got succesfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});