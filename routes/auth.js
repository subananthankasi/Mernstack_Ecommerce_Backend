const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserProfile, changePassword, updateProfile, getAllUsers, getSingleUSer, updateUser, deleteUser } = require("../controller/authController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/authenticate");
const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile)
router.route('/password/change').put(isAuthenticatedUser, changePassword)
router.route('/update').put(isAuthenticatedUser, updateProfile)


//admin
router.route('/admin/users').get(isAuthenticatedUser, authorizeRole('admin'), getAllUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRole('admin'), getSingleUSer)
                               .put(isAuthenticatedUser, authorizeRole('admin'), updateUser)
                                .delete(isAuthenticatedUser, authorizeRole('admin'), deleteUser)


module.exports = router