'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onImageClear: () => void;
  selectedImage: File | null;
  error?: string;
}

export default function ImageUploader({ onImageSelect, onImageClear, selectedImage, error }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      onImageSelect(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onImageClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              id="image-upload"
            />
            
            <motion.label
              htmlFor="image-upload"
              initial={false}
              animate={isDragging ? {
                scale: 1.02,
                borderColor: '#8b5cf6',
              } : {}}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative overflow-hidden group
                flex flex-col items-center justify-center w-full h-80
                border-2 border-dashed rounded-3xl
                cursor-pointer transition-all duration-300
                ${isDragging 
                  ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
                  : 'border-white/10 bg-white/5 backdrop-blur-sm hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-pink-500/10'
                }
                ${error ? 'border-red-500/50 bg-red-500/10' : ''}
              `}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <motion.div
                className="relative z-10 flex flex-col items-center justify-center p-8 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={isDragging ? {
                    scale: 1.1,
                    rotate: [0, -10, 10, -10, 0],
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className={`
                    w-24 h-24 mb-8 rounded-3xl flex items-center justify-center shadow-2xl
                    ${isDragging 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-500/50' 
                      : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30'
                    }
                  `}
                >
                  <Upload className="w-12 h-12" />
                </motion.div>
                <p className="text-2xl font-bold text-white mb-3">
                  Upload your photo
                </p>
                <p className="text-base text-white/60 mb-6">
                  Drag and drop or click to browse
                </p>
                <div className="flex items-center gap-2 text-sm text-white/40 px-5 py-2.5 bg-white/5 rounded-xl border border-white/10">
                  <ImageIcon className="w-5 h-5" />
                  <span>JPG, PNG, or WEBP (max 5MB)</span>
                </div>
              </motion.div>

              {/* Animated border gradient */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none">
                <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-md" />
                </div>
              </div>
            </motion.label>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm mt-3 text-center font-medium flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                {error}
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-80 rounded-3xl overflow-hidden shadow-2xl group"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className="absolute top-5 right-5 p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl hover:bg-white hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 z-10"
            >
              <X className="w-5 h-5 text-gray-800" />
            </motion.button>

            <div className="absolute bottom-5 left-5 right-5 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/95 backdrop-blur-md rounded-2xl px-5 py-3.5 shadow-xl border border-white/50"
              >
                <p className="text-sm font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  {selectedImage?.name}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}