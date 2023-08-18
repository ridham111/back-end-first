// models/issue.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  labels: { type: [String], default: [] },
  author: { type: String, required: true },
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
