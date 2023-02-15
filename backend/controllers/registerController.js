const usersDB = {
	users: require('../model/users.json'),
	setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(400).json({ 'message': 'Username or password required' });

	//check for duplicate users in db
	const duplicateUser = usersDB.users.find(person => person.username === user);
	if (duplicateUser) return res.status(409).json({ 'message': 'User already exists' }) //conflict
	try {
		//encrypyt password
		const hashedPwd = await bcrypt.hash(pwd, 10);
		const newUser = {
			'username': user,
			'roles': { "User": 2001 },
			'password': hashedPwd
		};
		usersDB.setUsers([...usersDB.users, newUser]);

		//save users to users.json file
		await fsPromises.writeFile(
			path.join(__dirname, '..', 'model', 'users.json'),
			JSON.stringify(usersDB.users)
		)
		console.log(usersDB.users);
		res.status(201).json({ 'message': `New user ${user} created` });
	} catch (err) {
		console.error(err);
		res.status(500).json({ 'message': err.message });
	}
}

module.exports = { handleNewUser };
