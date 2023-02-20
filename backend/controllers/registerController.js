const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ 'message': 'Username or password required' });

	//check for duplicate users in db
	const duplicateUser = await User.findOne({ username: user }).exec();
	if (duplicateUser) return res.status(409).json({ 'message': 'User already exists' }) //conflict
	try {
		//encrypyt password
		const hashedPwd = await bcrypt.hash(pwd, 10);

		//save user to db
		const newUser = await User.create({
			'username': user,
			'password': hashedPwd
		});
		console.log(newUser);
		res.status(201).json({ 'message': `New user ${user} created` });
	} catch (err) {
		console.error(err);
		res.status(500).json({ 'message': err.message });
	}
}

module.exports = { handleNewUser };
