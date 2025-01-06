import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import logo1 from '../assets/logo1.png';

// Extract API calls into a separate service
import { fetchPlayers, deletePlayer, pb } from '../services/playerService.ts';

export default function CreatePlayers() {
  const [showNotification, setNotificationStatus] = useState(false);
  const [displayValues, setDisplayValues] = useState([]);

  const fetchAndSetPlayers = useCallback(async () => {
    const players = await fetchPlayers();
    setDisplayValues(players);
  }, []);

  useEffect(() => {
    fetchAndSetPlayers();

    pb.collection('players').subscribe('*', async (payload) => {
      console.log(payload, 'payload');
      fetchAndSetPlayers();
    });

    return () => {
      pb.collection('players').unsubscribe('*');
    };
  }, [fetchAndSetPlayers]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const record = await pb.collection('admin').create({ startGame: true });
      console.log(record, 'data');
      setNotificationStatus(true);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  const removePlayer = useCallback(async (name) => {
    console.log(name, 'name');
    await deletePlayer(name.name);
  }, []);

  const spring = {
    type: 'spring',
    damping: 40,
    stiffness: 800,
    duration: 0.5,
  };

  return (
    <div className='flex items-center justify-center p-4 mt-5 rounded-xl sm:mt-10 md:p-10'>
      <form className='w-full'>
        <div className='mb-5'>
          <h1 className='mb-10 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
            Quizazoid - Admin Page
            <img className='w-32 h-32 ' src={logo1} alt='image description' />
          </h1>
          <p className='mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white'>
            Spillere:
          </p>
          {displayValues.map((value, index) => (
            <motion.div
              key={index}
              id={value.name}
              className='inline-flex items-center px-2 py-1 m-1 text-sm font-bold text-white rounded'
              style={{ backgroundColor: value.class }}
              initial={['visible', 'active']}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              exit={{ opacity: 0 }}
              transition={spring}
              animate={['visible', 'active']}
              layout
            >
              {value.name}
              <motion.button
                type='button'
                className='inline-flex items-center p-1 text-sm font-bold text-white bg-transparent rounded-lg ms-2 hover:bg-white hover:text-white dark:hover:bg-white dark:hover:text-black'
                data-dismiss-target='#badge-dismiss-green'
                aria-label='Remove'
                onClick={() => {
                  removePlayer(value);
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 1 },
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <svg
                  className='w-3 h-3 font-bold stroke-2 '
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
                <span className='sr-only'>Remove badge</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
        {showNotification && (
          <motion.div
            className='flex my-4'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            exit={{ opacity: 0 }}
            transition={spring}
            animate={['visible', 'active']}
            layout
          >
            <span
              id='badge-dismiss-green'
              className='inline-flex items-center px-2 py-1 text-sm font-medium text-white bg-green-900 rounded me-2'
            >
              Spillet blev startet
              <button
                type='button'
                className='inline-flex items-center p-1 text-sm text-white bg-transparent rounded-sm ms-2 dark:hover:bg-green-800 dark:hover:text-green-300'
                data-dismiss-target='#badge-dismiss-green'
                aria-label='Remove'
              >
                <svg
                  className='w-2 h-2'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 14 14'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                  />
                </svg>
                <span className='sr-only'>Remove badge</span>
              </button>
            </span>
          </motion.div>
        )}
        <div className='flex flex-col w-full h-full'>
          <motion.button
            type='submit'
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.5 },
            }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSubmit}
            className='focus:outline-none text-white  focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-green-600 hover:bg-green-700 focus:ring-green-800'
          >
            Start spil
          </motion.button>
        </div>
      </form>
    </div>
  );
}
