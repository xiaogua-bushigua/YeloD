export { default } from 'next-auth/middleware';

export const config = { matcher: ['/', '/data/:path*', '/queries', '/charts/:path*', '/screens/:path*', '/settings'] };

// testing