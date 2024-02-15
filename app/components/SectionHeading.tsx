const SectionHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className='my-5'>
      <h2 className='font-bold text-l mb-0 leading-2 text-white not-italic'>
        {title}
      </h2>

      <span className='text-white text-base mt-0'>{description}</span>
    </div>
  );
};

export default SectionHeading;
