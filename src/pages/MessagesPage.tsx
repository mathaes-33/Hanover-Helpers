import React from 'react';
import { Link } from 'react-router-dom';
import { MessageIcon } from '../components/Icons';
import Button from '../components/ui/Button';

const MessagesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center">
        <MessageIcon className="w-16 h-16 text-slate-300" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-slate-800">Your messages will appear here</h2>
      <p className="mt-2 text-slate-500">
        When you send or receive a message from a helper or job poster, you'll find it here.
      </p>
      <div className="mt-6">
        <Link to="/browse">
          <Button>Browse Jobs</Button>
        </Link>
      </div>
    </div>
  );
};

export default MessagesPage;