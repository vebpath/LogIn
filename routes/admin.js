const express = require('express')
const router = express.Router()




router.get('/dashboard',(req,res)=>{
    res.render("dashboard")
})
 
router.get('/message',(req,res)=>{
    res.render("message")
})
router.get('/analytics',(req,res)=>{
    res.render("analytics")
})
router.get('/gallery',(req,res)=>{
    res.render("gallery")
})
router.get('/courses',(req,res)=>{
    res.render("courses")
})
 
router.get('/settings',(req,res)=>{
    res.render("settings")
})
 




module.exports = router
