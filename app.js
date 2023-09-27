// app.js
const express = require('express');
const mongoose = require('mongoose');
const Project = require('./models/project');
const Issue = require('./models/issue');
const app = express();

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://Ridham:WiHCHo67LbhQmUAn@cluster0.sh7pu.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Home Page - Show a list of projects
app.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.render('home', { projects });
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Create Project Page
app.get('/projects/new', (req, res) => {
  res.render('createProject');
});

// Create Project - Handle form submission
app.post('/projects', async (req, res) => {
  try {
    const { name, description, author } = req.body;
    const project = new Project({ name, description, author });
    await project.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error creating project:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Project Detail Page
all_Issue=[];
app.get('/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    const { labels, author, search } = req.query;
    let issues = await Issue.find({ projectId });
     all_Issue = issues;
    console.log(issues);
    // Filtering by labels
    if (labels) {
      const selectedLabels = Array.isArray(labels) ? labels : [labels];
      issues = issues.filter(issue => {
        console.log( !Array.isArray(labels) && issue.labels.includes(labels),'------------------------------');
          if(!Array.isArray(labels) && issue.labels.includes(labels)){
            return issue
          }
          else if(Array.isArray(labels)) {
            // write your code here
            if(labels.find(element => issue.labels.includes(element))){
              return issue;
            }
          }
      }
      // issue.labels.some(label => selectedLabels.includes(labels))
      );
      console.log(issues);
      // console.log(issues,'--------------------');
    }

    // Filtering by author
    if (author) {
      issues = issues.filter(issue => issue.author === author);
    }

    // Searching by title and description
    if (search) {
      const searchQuery = new RegExp(search, 'i');
      issues = issues.filter(
        issue =>
          issue.title.match(searchQuery) || issue.description.match(searchQuery)
      );
    }
    
    res.render('projectDetail', { project, issues });
  } catch (err) {
    console.error('Error fetching project details:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Create Issue Page
app.get('/projects/:projectId/issues/new', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }
    res.render('createIssue', { project });
  } catch (err) {
    console.error('Error fetching project details:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Create Issue - Handle form submission
app.post('/projects/:projectId/issues', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, labels, author } = req.body;
    const issue = new Issue({ projectId, title, description, labels: labels.split(',').map(label => label.trim()), author });
    await issue.save();
    res.redirect(`/projects/${projectId}`);
  } catch (err) {
    console.error('Error creating issue:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// app.js
// GET /projects/:projectId
app.get('/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { labels, author, search } = req.query;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Fetch related issues from the database and populate the project object with them.
    let issues = await Issue.find({ projectId });

    // Filtering by label
    if (labels && labels.length > 0) {
      issues = issues.filter(issue => issue.labels.some(label => labels.includes(label)));
    }

    // Filtering by author
    if (author) {
      issues = issues.filter(issue => issue.author === author);
    }

    // Searching by title or description
    if (search) {
      const searchTerm = search.toLowerCase();
      issues = issues.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm) || issue.description.toLowerCase().includes(searchTerm)
      );
    }

    // Fetch all unique labels from the issues associated with the project
    const allLabels = Array.from(new Set(issues.flatMap(issue => issue.labels)));

    res.render('projectDetail', { project, issues, allLabels });
  } catch (err) {
    console.error('Error fetching project details:', err.message);
    res.status(500).send('Internal Server Error');
  }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
