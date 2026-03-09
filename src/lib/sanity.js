import { createClient } from '@sanity/client';

// Initialize Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '0euo9kc6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_DEVELOPER_TOKEN,
});

// Helper function to fetch data from Sanity
export async function fetchSanityData(query, params = {}) {
  try {
    const data = await client.fetch(query, params);
    return data;
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
    throw error;
  }
}

// GROQ queries for each data type
export const queries = {
  siteSettings: `*[_type == "siteSettings"][0] {
    heroBadge,
    heroTitle,
    heroSubtitle,
    heroTagline,
    heroDate,
    heroLocation,
    heroVideoSrc,
    eventStartDate,
    countdownTitle,
    countdownDescription,
  }`,

  hosts: `*[_type == "host"] | order(_createdAt asc) {
    _id,
    name,
    role,
    organization,
    "image": image.asset->url
  }`,

  startups: `*[_type == "startup"] | order(_createdAt asc) {
    _id,
    name,
    category,
    description,
    founded,
    funding,
    website,
    video,
    "logo": logo.asset->url
  }`,

  timeline: `*[_type == "timelineDay"] | order(date asc) {
    _id,
    title,
    date,
    "image": image.asset->url,
    events[] {
      title,
      time,
      venue,
      location,
      description,
      speakerName,
      speakerTitle,
      activities,
    }
  }`,

  mentors: `*[_type == "mentor"] | order(_createdAt asc) {
    _id,
    name,
    title,
    organization,
    bio,
    "image": image.asset->url
  }`,

  panelists: `*[_type == "panelistCategory"] | order(_createdAt asc) {
    _id,
    name,
    "institutions": institutions[] {
      name,
      "logo": logo.asset->url
    }
  }`,

  sponsors: `*[_type == "sponsor"] | order(order asc) {
    _id,
    name,
    tier,
    "logo": logo.asset->url,
    website,
  }`,

  judges: `*[_type == "judge"] | order(_createdAt asc) {
    _id,
    name,
    title,
    organization,
    category,
    bio,
    "image": image.asset->url
  }`,
};
