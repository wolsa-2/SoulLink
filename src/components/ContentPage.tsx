import React from 'react';

interface ContentPageProps {
  title: string;
  children: React.ReactNode;
}

export default function ContentPage({ title, children }: ContentPageProps) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold text-brand-900 mb-8 border-b border-brand-200 pb-4">
        {title}
      </h1>
      <div className="prose prose-brand max-w-none text-brand-800 leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  );
}
