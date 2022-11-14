const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const userData = require('../data/users')

router.get("/profile", async (req, res) => {
  if(req.oidc.isAuthenticated()){
  try {
    if(!ObjectId.isValid(req.params.id)) return res.status(400).json({error:"id is false"});
    let user = await userData.get(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ error: 'user not found' });
  }
}else{
  res.status(200).redirect('/login')
}
});


router.delete('/', async (req, res) => {
  if(req.oidc.isAuthenticated()){
  if(!ObjectId.isValid(req.params.id)) return res.status(400).json({error:"id is false"});
  try {
    await userData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: 'user not found' });
    return;
  }

  try {
    await userData.delete(req.params.id);
    res.status(200).json({"userId": `${req.params.id}`, "deleted": true});
  } catch (e) {
    res.status(500).json({ error: e });
  }
}else{
  res.status(200).redirect('/login')
}
});

router.get("/register", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    try {
      res.status(200).render("functions/registration");
    } catch (e) {
      res.status(500)
    }
  } else {
    res.status(500).redirect("/login");
  }
});

router.post("/register", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    try {
      const type=req.body.type
      const username=req.body.username
      const email=req.body.email
      const password=req.body.password
      const name=req.body.name
      let user=await userData.create(type,email,username,name,password)
      res.status(200).redirect('/')
      
    } catch (e) {
      res
        .status(500)
        .render("function/Appointment_Error", { error: e, title: "Error" });
    }
  } else {
    res.status(400).redirect("/users/login");
  }
});
module.exports = router;