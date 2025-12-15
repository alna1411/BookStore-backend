const express = require("express")
const { registerController, loginController, updateUserProfileController, getAllUsersAdminController, updateAdminProfileController, googleLoginController } = require("./controller/userController")
const { addBookController, getHomeBooksController, getAllBooksController, getABookController, getUserBooksController, deleteBookController, deleteUserAddedBookController, getUserBroughtBookController, getAllBooksAdminController, updateBookStatusAdminController, makeBookPaymentController } = require("./controller/bookController")
const jwtMiddleware = require("./middlewares/jwtMiddleware")
const multerConfig = require("./middlewares/imgMulterMiddleware")
const adminjwtMiddleware = require("./middlewares/adminJwtMiddleware")

const router = express.Router()

// register
router.post("/register", registerController)

// login
router.post("/login", loginController)

// google login
router.post("/google-login", googleLoginController)

// get home-books
router.get("/home-books",getHomeBooksController)

// ------users----------

// add book
router.post("/add-book",jwtMiddleware, multerConfig.array("uploadImages", 3), addBookController)

// get all books
router.get("/all-books",jwtMiddleware, getAllBooksController)

// get a book
router.get("/view-books/:id",jwtMiddleware,getABookController)

// get user added books
router.get("/user-books", jwtMiddleware, getUserBooksController)

// delete a user added book
router.delete("/delete-book/:id", deleteUserAddedBookController)

// get user brought book
router.get("/user-brought-book", jwtMiddleware, getUserBroughtBookController)

// update user profile
router.put("/update-user-profile", jwtMiddleware, multerConfig.single("profile"), updateUserProfileController)

// make payment -user
router.put("/make-payment", jwtMiddleware, makeBookPaymentController)

// -----------admin------------

// get all books
router.get("/get-allbooks",adminjwtMiddleware, getAllBooksAdminController)

// update book
router.put("/update-book/:id",updateBookStatusAdminController)

// get all users
router.get("/get-allUsers", adminjwtMiddleware, getAllUsersAdminController)

// update admin profile
router.put("/update-admin-profile",adminjwtMiddleware, multerConfig.single("profile"), updateAdminProfileController)





module.exports = router