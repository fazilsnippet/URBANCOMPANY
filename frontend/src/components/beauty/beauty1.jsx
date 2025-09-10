import { motion } from 'framer-motion';

export default function Beauty1() {
  return (
    <section className="w-full h-screen px-6 py-8 bg-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-rose-100 rounded-lg p-6 flex items-center justify-center shadow-md"
        >
          <h2 className="text-2xl font-bold text-rose-700">Beauty services at your doorstep</h2>
          <div className="flex ">box</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-yellow-100 rounded-lg p-6 flex items-center justify-center shadow-md"
        >
          <h2 className="text-2xl font-bold text-yellow-700">Right Column</h2>
        </motion.div>
      </div>
    </section>
  );
}
