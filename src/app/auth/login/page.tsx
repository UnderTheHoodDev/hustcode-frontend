'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const handleSubmitMail = async () => {
    await fetch('http://localhost:4000/api/auth/login-passwordless', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  };
  return (
    <main>
      <h1>This is where you ll put your email to get a magic link.</h1>
      <div>
        <div>
          <label htmlFor="email_address">
            Enter your email address
            <input
              type="email"
              id="email_address"
              className="border"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        </div>
        <button
          id="submit_email"
          className="bg-primary"
          type="button"
          onClick={handleSubmitMail}
        >
          Get magic link
        </button>
      </div>
    </main>
  );
}
