const { ObjectId } = require('mongodb');
const express = require('express');
const qrcode = require('qrcode');
const speakeasy = require('speakeasy');
const router = express.Router();
const userData = require('../data/users')
const familiesData=require('../data/families')
const { auth_middleware }  = require('./auth_middleware');

router.get("/profile", auth_middleware, async (req, res) => {
  try {
    let user = await userData.getByEmail(req.oidc.user.email);
    const family=await familiesData.getFamilyById(user.family)

    // get user type add by cchen
    var isParent = false
    if (user.type == "Parent") { var isParent = true }

    let parents=[];
    let children=[];
    let parent,child;
    for(let i=0;i<family.parents.length;i++)
    {
      parent = await userData.get(family.parents[i])
      parents.push(parent)
    }
    for(let i=0;i<family.children.length;i++)
    {
      child = await userData.get(family.children[i])
      children.push(child)
    }
    res.status(200).render("functions/profile",{ user:user,parents:parents,children:children, edit:false, 
      restrict_level:family.content_restrict, isParent:isParent, history: family.authHistory});
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post("/profile", auth_middleware, async (req, res) => {
    try{

      if(Object.keys(req.body).length >0){
        const username=req.body.username
        const name=req.body.name
        const content_restrict=req.body.content_restrict
        let user=await userData.getByEmail(req.oidc.user.email)

        // get user type add by cchen
        var isParent = false
        if (user.type == "Parent") { var isParent = true }

        await userData.updateUser(user._id.toString(),user.type,user.email,name,username,user.family)

        // set restrict level
        await familiesData.updateContentRestrict(user.family, content_restrict)

        res.status(200).redirect('/users/profile')
      }else{
        let user = await userData.getByEmail(req.oidc.user.email);

        // get user type add by cchen
        var isParent = false
        if (user.type == "Parent") { var isParent = true }

        const family=await familiesData.getFamilyById(user.family) 
        let parents=[];
        let children=[];
        let parent,child;
        for(let i=0;i<family.parents.length;i++)
        {
          parent = await userData.get(family.parents[i])
          parents.push(parent)
        }
        for(let i=0;i<family.children.length;i++)
        {
          child = await userData.get(family.children[i])
          children.push(child)
        }
        res.status(200).render("functions/profile",{ user:user,parents:parents,children:children, edit:true, 
          restrict_level:family.content_restrict, isParent:isParent, history: family.authHistory});
      }
    }catch(e){
      res.status(400).json({error:e})
    }
  }
)

router.get("/register", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    try {
      const secret = speakeasy.generateSecret();
      const qrsecret = await qrcode.toDataURL(secret.otpauth_url);
      const twofasetup = {
        qrsecret: qrsecret,
        secret: secret
      }
      res.status(200).render("functions/registration",{ user: req.oidc.user, twofa: twofasetup});
    } catch (e) {
      res.status(500)
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/register", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    try {
      const type=req.body.type
      const username=req.body.username
      const name=req.body.name
      const email = req.oidc.user.email

      const base32secret = req.body.base32;
      const userToken = req.body.token;
      const twofaReset = {
        qrsecret: req.body.qr,
        secret: {
          base32: req.body.base32
        }
      }

      const verified = speakeasy.totp.verify({ secret: base32secret, encoding: 'base32', token: userToken });
      if (!verified) {
        // TODO: Throw error
      }

      let user=await userData.create(type,email,username,name,base32secret);
      let family;
      if(type=="Parent"){
        if(!req.body.parentemail) family=await familiesData.createFamily([user._id])
        else {
          const baseParentEmail = req.body.parentemail
          const baseParent = await userData.getByEmail(baseParentEmail)
          const baseFamilyId = baseParent.family
          const baseFamily = await familiesData.getFamilyById(baseFamilyId)
          baseFamily.parents.push(user._id);
          await familiesData.updateFamily(baseFamilyId, baseFamily.parents, baseFamily.children);
        }
      }
      else if(type=="Child") {
        if(!req.body.parentemail) res.status(400).render("functions/registration",{user: req.oidc.user, twofaSetup: twofaReset, error:"As a child, you should type parent email"})
        else {
          const baseParentEmail = req.body.parentemail
          const baseParent = await userData.getByEmail(baseParentEmail)
          const baseFamilyId = baseParent.family
          const baseFamily = await familiesData.getFamilyById(baseFamilyId)
          baseFamily.children.push(user._id);
          await familiesData.updateFamily(baseFamilyId, baseFamily.parents, baseFamily.children);
        }
      }
      res.status(200).redirect('/')
      
    } catch (e) {
      res.status(400).render("functions/registration",{user: req.oidc.user, twofaSetup: twofaReset, error:e})
    }
  } else {
    res.status(400).redirect("/users/login");
  }
});

router.get('/twofa', async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    try {
      return res.status(200).render("functions/twofalogin");
    } catch (e) {
      return res.status(500)
    }
  } else {
    return res.redirect("/login");
  }
})

router.post('/twofa', async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const user = await userData.getByEmail(req.oidc.user.email);
    
    const token = req.body.token;
    const secret = user.secret;

    const validated = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
    });

    if (validated){
      req.session.user = user.username;
      await familiesData.updateFamilyAuthHistory(user.family, [user.username, 'LOGIN', new Date().toUTCString()]);
      return res.status(200).redirect('/');
    } else {
      return res.status(400).render('functions/twofalogin');
    }
  } else {
    return res.redirect("/login");
  }
})

router.get('/logout', async (req, res) => {
  const user = await userData.getByEmail(req.oidc.user.email);
  await familiesData.updateFamilyAuthHistory(user.family, [user.username, 'LOGOUT', new Date().toUTCString()]);
  req.session.destroy();
  res.redirect('/logout');
})

module.exports = router;