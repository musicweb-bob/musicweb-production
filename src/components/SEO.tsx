import React from 'react';
import { Helmet } from 'react-helmet-async';

export function SEO({ title, description }: { title: string; description?: string }) {
  const siteTitle = "MUSICweb";
  return (
    <Helmet>
      <title>{`${title} | ${siteTitle}`}</title>
      <meta name="description" content={description || "The global hub for sound and gear."} />
    </Helmet>
  );
}