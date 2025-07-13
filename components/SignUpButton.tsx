'use client';

import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function SignUpButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href="/login?mode=signup"
        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-xl"
      >
        <UserPlus className="h-4 w-4" />
        <span>Sign Up</span>
      </Link>
    </motion.div>
  );
} 