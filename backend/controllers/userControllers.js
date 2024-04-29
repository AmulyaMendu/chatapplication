const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const generateToken = require("../config/generateToken")




const registerUser = asyncHandler(async (req, res) => {  // if there is any error in this controller.we need to handle those errors.there is a package called express async handler
    const { name, email, password, pic } = req.body
    if (!name || !password || !email) {
        res.status(400)
        throw new Error("please enter all fields")
    }
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("User already Exists")
    }
    const user = await User.create({
        name,
        email,
        password,
        pic
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("failed to create user")
    }
})




const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid email or password")
    }
})


// api/user?search=ammu
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            {
                name: { $regex: req.query.search, $options: "i" }
            }, {
                email: { $regex: req.query.search, $options: "i" }
            }
        ]
    } : {

    }
    // console.log(keyword)
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
})


module.exports = { registerUser, authUser, allUsers }