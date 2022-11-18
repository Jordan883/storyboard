const express = require("express");
const router = express.Router();
const data = require("../data/articles");
const userdata = require("../data/users");
const commentdata = require("../data/comment");
var xss = require("xss");

