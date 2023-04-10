import express from 'express';


import { signin, getuser, signup, updateUser, deleteUser, verifyAccount, sendOTP,resetPassword, verifyOTP, desactivateUser, activateUser, sendactivationmail, sendgitrepomail, userimage, gitlogin, createRepository, pushRepository } from "../Controllers/UserController.js";
import protect from '../Middlewares/autorization.js';
import multer from '../middlewares/multer-config.js';



const router = express.Router()

router
.route("/signin")//
.post(signin)

router
  .route("/verify-account")//
  .get(verifyAccount)
  
router
  .route("/profile")//
  .get(
    protect,
    getuser
    )

router
  .route("/signup")//
  .post(signup)

router
 .route("/update")//
 .put(
  protect,
  updateUser
  );

router
  .route("/delete/:id")
  .delete(deleteUser);

  router
  .route("/otpsend")//
  .post(
    sendOTP
    )

router
 .route("/resetPassword")//
 .put(
  resetPassword
  );

router
  .route("/verifyOTP")//
  .post(
    verifyOTP
  );

router
  .route("/desactivateUser")//
  .put(
    protect,
    desactivateUser
  );

router
  .route("/activateUser")//
  .get(
    activateUser
  );

router
  .route("/sendactivationmail")//
  .put(
    sendactivationmail
  );

router
  .route("/sendgitrepomail")
  .post(sendgitrepomail)

router
  .route("/userimage")
  .put(
    multer("image", 512 * 1024),
    protect,
    userimage
  );

router
  .route("/gitlogin")//
  .post(gitlogin)

router
  .route("/createRepository")
  .post(createRepository)


router
  .route("/pushRepository")
  .post(pushRepository)
  

  

export default router;