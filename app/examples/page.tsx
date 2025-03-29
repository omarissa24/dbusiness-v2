"use client";

import styles from "./page.module.css";

const cards = [
  { name: "John Smith", title: "Software Engineer" },
  { name: "Sarah Johnson", title: "Product Designer" },
  { name: "Michael Brown", title: "Business Analyst" },
  { name: "Emily Davis", title: "Marketing Manager" },
];

export default function ExamplesPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold text-white mb-12 text-center'>
          Example Cards
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {cards.map((card, index) => (
            <div key={index} className={styles.perspective_1000}>
              <div
                className={`relative w-full h-64 transition-transform duration-700 ${styles.transform_style_3d} hover:${styles.rotate_y_180}`}
              >
                {/* Front of card */}
                <div
                  className={`absolute w-full h-full ${styles.backface_hidden} bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 shadow-xl`}
                >
                  <div className='text-white'>
                    <h2 className='text-2xl font-bold mb-2'>{card.name}</h2>
                    <p className='text-gray-200'>{card.title}</p>
                  </div>
                  <div className='absolute bottom-4 right-4'>
                    <div className='w-12 h-12 bg-white/20 rounded-full'></div>
                  </div>
                </div>

                {/* Back of card */}
                <div
                  className={`absolute w-full h-full ${styles.backface_hidden} bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl p-6 shadow-xl ${styles.rotate_y_180}`}
                >
                  <div className='text-white'>
                    <div className='w-full h-8 bg-white/20 rounded mb-4'></div>
                    <div className='w-3/4 h-4 bg-white/20 rounded mb-2'></div>
                    <div className='w-1/2 h-4 bg-white/20 rounded'></div>
                  </div>
                  <div className='absolute bottom-4 right-4'>
                    <div className='w-12 h-12 bg-white/20 rounded-full'></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
