'use client';
import { useState } from 'react';
import Form from '../components/Form';

const page = () => {
  const [success, setSuccess] = useState(false);
  const [link, setLink] = useState('');

  return (
    <main className='min-h-screen bg-black flex justify-center items-center p-32'>
      {!success && (
        <div className='w-[800px] mx-auto bg-black border rounded-xl shadow-xl p-7 px-7'>
          <h1 className='font-medium text-3xl'>Create a Frame Quest</h1>
          <Form setSuccess={setSuccess} />
        </div>
      )}
      {success && (
        <div className='max-w-xl mx-auto bg-black border rounded-xl text-center shadow-xl p-7 px-7'>
          <h1 className='font-medium text-3xl'>Here's your frame link 🎉</h1>
          <p className='mt-3'>{link}</p>
        </div>
      )}
    </main>
  );
};

export default page;
