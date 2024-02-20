import groq from "groq";

import { SEO } from "./seo";
import { VIDEO } from "./video";

export const EPISODE = groq`
  _id,
  title,
  description,
  "releaseDate": release_date,
  "slug": "/video/" + slug.current,
  ${SEO},
  ${VIDEO}
`;
