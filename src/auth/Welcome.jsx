import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <AuthLayout heroImage="/auth/login-hero.jpg">
      <div className="mb-8 text-center">
        <h2
          className="text-3xl text-[#2A3A3F] dark:text-white mb-3 tracking-tight leading-tight"
          style={{ fontFamily: 'Fraunces, serif', fontWeight: 600 }}
        >
          You're already loved here.
        </h2>
        <p className="text-sm text-[#2A3A3F]/75 dark:text-white/65 leading-relaxed">
          Six honest questions. About a minute. No right answers — just where you are. Then we'll show you what the next 90 days could look like.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/quiz')}
        className="w-full bg-[#FD9C2D] hover:bg-[#e88d1f] text-white font-bold py-3.5 rounded-xl shadow-md transition-colors min-h-[52px]"
      >
        Let's begin →
      </button>

      <p className="text-center text-sm text-[#2A3A3F]/70 dark:text-white/60 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#FD9C2D] font-bold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
