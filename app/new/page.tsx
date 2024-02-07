'use client';
import Form from '../components/Form';

const page = () => {
  return (
    <main className='min-h-screen bg-orange-100 flex justify-center items-center'>
      <div className='w-96 mx-auto bg-white rounded-xl shadow-xl p-7 px-7'>
        <h1 className='text-neutral-800 font-bold text-center mb-5 text-2xl'>
          QuestCaster | beyondClub
        </h1>
        <Form />
      </div>
    </main>
  );
};

export default page;
