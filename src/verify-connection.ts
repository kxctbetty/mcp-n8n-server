#!/usr/bin/env node

import dotenv from 'dotenv';
import axios from 'axios';

// Initialize dotenv
dotenv.config();

// Get configuration from environment variables
const n8nHostUrl = process.env.N8N_HOST_URL;
const projectId = process.env.PROJECT_ID;
const apiKey = process.env.N8N_API_KEY;

if (!n8nHostUrl) {
  console.error('Error: N8N_HOST_URL is not set in the .env file');
  process.exit(1);
}

if (!apiKey) {
  console.error('Error: N8N_API_KEY is not set in the .env file');
  process.exit(1);
}

// Create axios instance
const n8nApi = axios.create({
  baseURL: n8nHostUrl + '/api/v1',
  headers: {
    'X-N8N-API-KEY': apiKey,
  },
});

// Test connection
console.log('Testing connection to n8n API...');
console.log(
  `URL: ${n8nHostUrl}/api/v1${
    projectId ? '/workflows?projectId=' + projectId : '/workflows'
  }`
);

n8nApi
  .get<any[]>(projectId ? `/workflows?projectId=${projectId}` : '/workflows')
  .then((response) => {
    console.log('✅ Connection successful!');
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Found ${response.data.length} workflows`);
  })
  .catch((error) => {
    console.error('❌ Connection failed:');
    if (error.response) {
      console.error(
        `Status: ${error.response.status} ${error.response.statusText}`
      );
      console.error('Response:', error.response.data);
    } else if (error.request) {
      console.error(
        'No response received from server. Check your N8N_HOST_URL and network connection.'
      );
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  });
