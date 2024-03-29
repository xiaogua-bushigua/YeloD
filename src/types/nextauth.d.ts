import 'next-auth';

declare module 'next-auth' {
	interface User {
		_id: string;
    username: string;
    password: string;
	}

	interface Session {
		user: User;
	}
  interface Profile {
		avatar_url: string;
		login: string;
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    username: string;
    password: string;
  }
}