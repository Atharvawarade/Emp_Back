// routes/projects.js
const express = require("express");
const projectRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// Get all projects
projectRoutes.route("/projects").get(async (req, res) => {
  const db_connect = dbo.getDb();
  try {
    const projects = await db_connect.collection("projects").find({}).toArray();
    res.status(200).json(projects);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Get a single project by ID
projectRoutes.route("/projects/:id").get(async (req, res) => {
  const db_connect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  try {
    const project = await db_connect.collection("projects").findOne(query);
    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Add a new project
projectRoutes.route("/projects/add").post(async (req, res) => {
  const db_connect = dbo.getDb();
  const newProject = {
    name: req.body.name,
    description: req.body.description,
    deadline: req.body.deadline,
    teamMembers: req.body.teamMembers,
  };
  try {
    const result = await db_connect.collection("projects").insertOne(newProject);
    res.status(201).json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

// Update a project by ID
projectRoutes.route("/projects/update/:id").post(async (req, res) => {
  const db_connect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  const updates = {
    $set: {
      name: req.body.name,
      description: req.body.description,
      deadline: req.body.deadline,
      teamMembers: req.body.teamMembers,
    },
  };
  try {
    const result = await db_connect.collection("projects").updateOne(query, updates);
    res.status(200).json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

// Delete a project by ID
projectRoutes.route("/projects/:id").delete(async (req, res) => {
  const db_connect = dbo.getDb();
  const query = { _id: new ObjectId(req.params.id) };
  try {
    const result = await db_connect.collection("projects").deleteOne(query);
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Project not found" });
    } else {
      res.status(200).json({ message: "Project deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting project" });
  }
});

module.exports = projectRoutes;
