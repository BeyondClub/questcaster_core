'use client';
import Form from '../components/Form';
import SectionHeading from '../components/SectionHeading';

const page = () => {
  return (
    <main className='min-h-screen bg-black flex justify-center items-center p-32'>
      <div className='w-[700px] mx-auto bg-black border rounded-xl shadow-xl p-7 px-7'>
        <h1 className='font-medium text-3xl'>Create a Frame Quest</h1>
        <Form />
      </div>
    </main>
  );
};

export default page;
