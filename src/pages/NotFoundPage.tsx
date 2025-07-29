

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

interface NotFoundPageProps {
  message?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ message }) => {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-slate-800">Page Not Found</h2>
      <p className="mt-2 text-slate-500">
        {message || "Sorry, we couldn’t find the page you’re looking for."}
      </p>
      <div className="mt-8">
        <Link to="/">
            <Button>Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;