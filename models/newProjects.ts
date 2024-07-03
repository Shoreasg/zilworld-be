import mongoose, { Schema } from "mongoose";

const announcementSchema = new Schema({
  title: { type: String, required: true },
  preview: { type: String, required: true },
  pinned: {type: Boolean, required: true}
});

const tokenSchema = new Schema({
  tokenAddress: { type: String },
  zilworldURL: { type: String },
  tokenCategory: { type: String },
  tokenLogo: { type: String },
});

const websiteSchema = new Schema({
  websiteURL: { type: String },
});

const twitterSchema = new Schema({
  twitterURL: { type: String },
});

const telegramSchema = new Schema({
  telegramURL: { type: String },
});

const discordSchema = new Schema({
  discordURL: { type: String },
});

const viewblockSchema = new Schema({
  viewblockURL: { type: String },
});

const whitepaperSchema = new Schema({
  whitepaperURL: { type: String },
});

const githubSchema = new Schema({
  githubURL: { type: String },
});

const mediumSchema = new Schema({
  mediumURL: { type: String },
});

const linkedinSchema = new Schema({
  linkedinURL: { type: String },
});

const youtubeSchema = new Schema({
  youtubeURL: { type: String },
});

const redditSchema = new Schema({
  redditURL: { type: String },
});

const facebookSchema = new Schema({
  facebookURL: { type: String },
});

const relatedSchema = new Schema({
  relatedName: { type: String },
  relatedURL: { type: String },
});

const projectsSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  announcements: [announcementSchema],
  icon: { type: String, required: true },
  updated_at: { type: String },
  category: [{ type: String, required: true }],
  tokens: [tokenSchema],
  NFT_address: [{ type: String }],
  marketplace_arky: { type: Boolean },
  marketplace_zildex: { type: Boolean },
  marketplace_cathulu: { type: Boolean },
  website: [websiteSchema],
  telegram: [telegramSchema],
  twitter: [twitterSchema],
  discord: [discordSchema],
  viewblock: [viewblockSchema],
  whitepaper: [whitepaperSchema],
  github: [githubSchema],
  medium: [mediumSchema],
  linkedin: [linkedinSchema],
  youtube: [youtubeSchema],
  reddit: [redditSchema],
  facebook: [facebookSchema],
  related: [relatedSchema],
  isActive: { type: Boolean },
  isBuilding: { type: Boolean },
  isNew: { type: Boolean },
});

export default mongoose.model("NewProjects", projectsSchema);
