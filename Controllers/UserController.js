import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { Octokit } from "@octokit/rest";
import { exec } from "child_process";

import sendMail, { verificationMail, forgotpasswordMail, activationMail, gitMail } from "../middlewares/nodemail.js";



export async function signin (req,res) {
    const {username,password} =  req.body;
    const user = await User.findOne({"username": username, accounttype:"normaluser"});
    if(!user){
        return res.status(403).json({error: "user not found"});
    }
    if(!user.active){
      return res.status(404).json({error: "user desactivated"});
  }
    const passwordCompare = await bcrypt.compare(password,user.password);
    if(!passwordCompare){
        return res.status(402).json({error : "password failed"})
    }
    if(!user.isVerified){
        return res.status(401).json({error : "UnAuthorized",username:user.username}) 
    }
    const payload = {id:user.id};
    const token = jwt.sign(payload,process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
    });
    res.status(200).json({success: true , token: token});
}


export async function getuser(req, res) {
  if(!req.user){
    return res.status('401').json({error: "You're not authenticated!"});
    }
  const user = await User.findById(req.user._id);

res.status(200).json({user: user});
}

export async function signup(req , res){
  try {
      var { username , password, email, image, accounttype, bio } = req.body;
      var exists = await User.findOne({username: username, accounttype:"normaluser"});
      if (exists) {
          return res.status(403).json({error: "user exists !"});
        }
     var  encryptedPassword = await bcrypt.hash(password, 10);
     const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false,digits:true,lowerCaseAlphabets:false })
      var user = await User.create({
       username,
       password: encryptedPassword,
       otp: otp,
       email,
       image,
       accounttype,
       bio
      });
    verificationMail(req,user)
     res.status(200).json({ message : "user added" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
}


export async function verifyAccount(req,res){
    try{
        const username = req.query.username;
        const user= await User.findOne({"username": username, accounttype:"normaluser"})
        console.log(user);
        if(user){
            user.isVerified=true
            await user.save()
            res.render('pages/verify')
        }else{
            res.status(401).json({Error:"Error process"})
        }
    }
    catch(e){
        res.status(500).json({Error:"Server error"})
    }
}

export async function updateUser(req,res){
  try {
    if(!req.user){
      return res.status('401').json({error: "You're not authenticated!"});
      }
      const user = await User.findById(req.user._id);
      var password=req.body.password;
      var email=req.body.email;
      var bio=req.body.bio;
      const  encryptedPassword = await bcrypt.hash(password, 10);
      user.password=encryptedPassword;
      user.email=email;
      user.bio=bio;
      user.save();
      res.status(200).json( {message : "user updated sucessfully" });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser (req,res){
  if(!req.user){
    return res.status('401').json({error: "You're not authenticated!"});
    }
    User.findByIdAndRemove(req.user._id)
    .then(() => {
      res.status(200).json( {message : "user deleted" });
    })
    .catch(err => {
      res.status(500).json({ error: err });

    })
}

export async function desactivateUser (req,res){
    try{
      if(!req.user){
        return res.status('401').json({error: "You're not authenticated!"});
        }
        const user= await User.findOne({"_id": req.user._id})
        console.log(user);
        if(user){
            user.active=false;
            await user.save()
            res.status(200).json( {message : "user desactivated" })
        }else{
            res.status(402).json({Error:"Error process"})
        }
    }
    catch(e){
        res.status(500).json({Error:"Server error"})
    }
}


export async function activateUser (req,res){
  try{
    const username = req.query.username;
    const user= await User.findOne({"username": username, accounttype:"normaluser"})
    console.log(user);
    if(user){
        user.active=true
        await user.save()
        res.render('pages/activate')
    }else{
        res.status(401).json({Error:"Error process"})
    }
}
catch(e){
    res.status(500).json({Error:"Server error"})
}
}

export async function sendOTP(req,res){

  const user = await User.findOne({ username:req.body.username, accounttype:"normaluser"});
  console.log(user);
  const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false,digits:true,lowerCaseAlphabets:false })
      user.otp = otp;
      user.save();
      forgotpasswordMail(req,user)
      .then(() => {
        res.status(200).json({ message:"otp mail sent" });
      })
      .catch(err => {
        res.status(500).json({ error: err })
      })
}

export async function verifyOTP(req,res){
  try {
    const user = await User.findOne({ otp:req.body.otp });
    if(user)
    {
      res.status(200).json({ message:"correct otp" });
    }
    else
    {
      res.status(500).json({ message:"wrong otp" });
    }
    
  } catch (error) {
    console.log(error);
  }

}


export async function resetPassword(req, res) {

    const user = await User.findOne({ username:req.body.username, accounttype:"normaluser"});
    var password = req.body.password;
    var  hashed = await bcrypt.hash(password, 10);
    user.password=hashed;
    user.save()
  .then(() => {
    res.status(200).json({ message:"new password" });
  })
  .catch(err => {
    res.status(500).json({ error: err })
  })
}


export async function sendactivationmail(req , res){
  try {
      var username = req.body.username;
      var user = await User.findOne({username : username, accounttype:"normaluser"});
      activationMail(req,user)
     res.status(200).json({ message : "activation mail sent" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
}


export async function sendgitrepomail(req,res){

    const user = await User.findOne({ username:req.body.username, accounttype:"normaluser"});
    console.log(user);
    var link = req.body.link
    gitMail(req,user,link)
        .then(() => {
          res.status(200).json({ message:"git repository mail sent" });
        })
        .catch(err => {
          res.status(500).json({ error: err })
        })
}

export async function userimage(req, res) {
    if(!req.user){
      return res.status('401').json({error: "You're not authenticated!"});
      }
    let newUser = {};
      newUser = {
        image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`

      }
    User.findByIdAndUpdate(req.user._id, newUser)
    .then(() => {
      res.status(200).json({ message:"user image modified" });
    })
    .catch(err => {
      res.status(500).json({ error: err })
    })
}

export async function gitlogin(req, res) {
  try {
    const octokit = new Octokit({
      auth: req.body.token
    });
    const response = await octokit.users.getAuthenticated();
    const mail = await octokit.users.listEmailsForAuthenticatedUser();
    const username = response.data.login;
    const bio = response.data.bio;
    const exists = await User.findOne({ username, accounttype:"gituser" });
    if (exists) {
      const payload = {id:exists.id};
      const token = jwt.sign(payload,process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
      });
      return res.status(201).json({success: true , token: token});
    } else {
      const user = await User.create({
        username,
        email: mail.data[0].email,
        image: response.data.avatar_url,
        isVerified: true,
        password:"",
        otp:"",
        accounttype: "gituser",
        bio:bio,
      });
      const payload = {id:user.id};
      const token = jwt.sign(payload,process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
      });
      res.status(200).json({success: true , token: token});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function createRepository(req, res) {
  const {reponame, repodescription, commit, auth} =  req.body;
  try {
    const octokit = new Octokit({
      auth: auth
    });
    const response = await octokit.users.getAuthenticated();
    const gitusername = response.data.login;
    const gitemail = (await octokit.users.listEmailsForAuthenticatedUser()).data[0].email;
    const scriptPath = 'push.sh';
    await octokit.repos.createForAuthenticatedUser({
      name: reponame,
      description: repodescription,
      auto_init: true
    });
    exec(`bash ${scriptPath} ${gitusername} ${reponame} ${auth} ${gitemail} ${commit}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
    res.status(200).json({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
/*
export async function pushRepository(req, res) {


  const scriptPath = 'push.sh';

  const {reponame, commit, auth} =  req.body;


  const octokit = new Octokit({
    auth: auth
  }); 

    const response = await octokit.users.getAuthenticated();
    const mail = await octokit.users.listEmailsForAuthenticatedUser();
    const username = response.data.login;
  
  
  exec(`bash ${scriptPath} ${username} ${reponame} ${auth} ${mail} ${commit}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

}*/


export async function pushRepository(req, res) {

  const scriptPath = 'push.sh';

  const {username, reponame, commit, auth, mail} =  req.body;

  exec(`bash ${scriptPath} ${username} ${reponame} ${auth} ${mail} ${commit}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.status(200).json({ success: true });
  });
}