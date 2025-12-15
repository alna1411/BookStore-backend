const users = require("../model/userModel")
const jwt = require("jsonwebtoken")


// register
exports.registerController = async (req, res) => {
    console.log(`Inside Register Controller`);
    const { username, email, password } = req.body
    console.log(username, email, password);

    // logic
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(404).json('User Already Exists...Please Login!!! ')
        } else {
            const newUser = new users({
                username,
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (error) {
        res.status(500).json(error)
    }

    // console.log(req);
    // res.status(200).send("Register Request Received")

}

// login
exports.loginController = async (req, res) => {
    console.log("Inside Login Controller");
    const { email, password } = req.body
    console.log(password, email);
    // logic
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.JWTSecretKey)
                res.status(200).json({ existingUser, token })
            } else {
                res.status(401).json("Invalid Credentials!!!")
            }
        } else {
            res.status(404).json("User Not Found...Please Register!!!")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// google login
exports.googleLoginController = async (req, res) => {
    console.log("Inside googleLogin Controller");
    const { password, email, username, profile } = req.body
    console.log(password, email, username, profile);
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.JWTSecretKey)
            res.status(200).json({ existingUser, token })
        } else {
            const newUser = new users({
                username, email, password, profile
            })
            await newUser.save()
            const token = jwt.sign({ userMail: newUser.email, role: newUser.role }, process.env.JWTSecretKey)
            res.status(200).json({ existingUser:newUser, token })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//update user profile
exports.updateUserProfileController = async (req, res) => {
    console.log("inside update user profile controller");
    const { username, password, bio, role, profile } = req.body
    const updateProfile = req.file ? req.file.filename : profile
    const email = req.payload

    try {
        const updateUser = await users.findOneAndUpdate({ email }, { username, password, bio, role, profile: updateProfile, email }, { new: true })
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json(error)

    }
}

// ----------------admin---------------------

// get all users
exports.getAllUsersAdminController = async (req, res) => {
    console.log("Inside get all users admin controller");
    const userMail = req.payload
    try {
        const allUsers = await users.find({ email: { $ne: userMail } })
        res.status(200).json(allUsers)

    } catch (error) {
        res.status(500).json(error)
    }

}

// update admin profile
exports.updateAdminProfileController = async (req, res) => {
    console.log("inside admin update profile controller");
    // get data
    const { username, password, profile } = req.body
    const email = req.payload
    const role = req.role
    console.log(username, password, role);

    const uploadProfile = req.file ? req.file.filename : profile
    console.log(uploadProfile);

    try {
        const updateAdmin = await users.findOneAndUpdate({ email }, { username, email, password, profile: uploadProfile, role }, { new: true })
        res.status(200).json(updateAdmin)
    } catch (error) {
        res.status(500).json(error)
    }
}


