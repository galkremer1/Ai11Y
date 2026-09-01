export const originalCode = `import React from 'react';

function LoginForm() {
  return (
    <form>
      <div>
        <label>Email</label>
        <input type="email" autoFocus />
      </div>
      <div>
        <label>Password</label>
        <input type="password" />
      </div>
      <div onClick={() => handleSubmit()}>
        <button class="icon-btn">
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <img src="/logo.png" />
      <a href="#">Learn more</a>
    </form>
  );
}

export default LoginForm;
`;

export const fixedCode = `import React from 'react';

function LoginForm() {
  return (
    <form>
      <div>
        <label htmlFor="email-input">Email</label>
        <input id="email-input" type="email" />
      </div>
      <div>
        <label htmlFor="password-input">Password</label>
        <input id="password-input" type="password" />
      </div>
      <div>
        <button
          type="submit"
          aria-label="Submit login form"
          onClick={() => handleSubmit()}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <img src="/logo.png" alt="Company logo" />
      <a href="/learn-more">Learn more about our accessibility practices</a>
    </form>
  );
}

export default LoginForm;
`;
