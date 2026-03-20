'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Heart, Share2 } from 'lucide-react';

// Sample gallery images - in production, these would come from a database
const SAMPLE_GALLERY = [
  {
    id: 1,
    title: 'Eid Mubarak Celebration',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=800&fit=crop',
    likes: 42,
  },
  {
    id: 2,
    title: 'Golden Eid Card',
    image: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=800&h=800&fit=crop',
    likes: 38,
  },
  {
    id: 3,
    title: 'Traditional Greeting',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&h=800&fit=crop',
    likes: 56,
  },
  {
    id: 4,
    title: 'Modern Design',
    image: 'https://images.unsplash.com/photo-1533236898118-a14d24c407b5?w=800&h=800&fit=crop',
    likes: 31,
  },
  {
    id: 5,
    title: 'Elegant Purple Theme',
    image: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800&h=800&fit=crop',
    likes: 67,
  },
  {
    id: 6,
    title: 'Floral Patterns',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop',
    likes: 45,
  },
];

export default function GalleryPage() {
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDownload = (image: typeof SAMPLE_GALLERY[0]) => {
    // In production, this would download the actual image
    alert(`Downloading: ${image.title}`);
  };

  const handleShare = (image: typeof SAMPLE_GALLERY[0]) => {
    if (navigator.share) {
      navigator.share({
        title: image.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Greeting <span className="text-[#423099]">Gallery</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore beautiful Eid greetings created by our community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SAMPLE_GALLERY.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-xl font-bold mb-4">
                        {item.title}
                      </h3>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownload(item)}
                          className="flex-1 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg flex items-center justify-center"
                        >
                          <Download className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleShare(item)}
                          className="flex-1 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg flex items-center justify-center"
                        >
                          <Share2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleLike(item.id)}
                          className="flex-1 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-lg flex items-center justify-center"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              likedImages.has(item.id) ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Heart className="w-4 h-4" />
                    <span>{item.likes + (likedImages.has(item.id) ? 1 : 0)}</span>
                  </div>
                  <button className="text-[#423099] font-medium hover:underline">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Create Your Own Unique Greeting
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users and create beautiful, personalized Eid greetings
            </p>
            <a
              href="/"
              className="inline-block bg-white text-[#423099] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Creating
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}