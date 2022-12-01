const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const userData = require('../data/users')
const familiesData=require('../data/families')

router.get("/profile", async (req, res) => {
  if(req.oidc.isAuthenticated()){
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

    const restrict_level = family.content_restrict

    res.status(200).render("functions/profile",{ user:user,parents:parents,children:children, edit:false, restrict_level:restrict_level, isParent:isParent });
  } catch (e) {
    res.status(400).json({ error: e });
  }
}else{
  res.status(200).redirect('/login')
}
});

router.post("/profile", async (req, res) => {
  if(req.oidc.isAuthenticated()){
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

        // get restrict level
        const restrict_level = family.content_restrict

        res.status(200).render("functions/profile",{ user:user,parents:parents,children:children, edit:true, restrict_level:restrict_level, isParent:isParent });
      }
    }catch(e){
      res.status(400).json({error:e})
    }
  }
  else res.status(200).redirect('/login')
})


router.get("/register", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    try {
      res.status(200).render("functions/registration",{ user: req.oidc.user});
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
      const name=req.body.name
      const email = req.oidc.user.email

      let user=await userData.create(type,email,username,name)
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
        if(!req.body.parentemail) res.status(400).render("functions/registration",{error:"As a child, you should type parent email"})
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
      res.status(400).render("functions/registration",{error:e})
    }
  } else {
    res.status(400).redirect("/users/login");
  }
});
module.exports = router;