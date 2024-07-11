import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib//mongodb';
import { UserModel } from '@/lib/models';
import { User, Session, Account, Profile } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export const authOptions: AuthOptions = {
	pages: {
		signIn: '/login',
	},
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
			httpOptions: {
				timeout: 20000,
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			httpOptions: {
				timeout: 20000,
			},
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {},
			async authorize(credentials: any, req) {
				try {
					await dbConnect();
					const user = await UserModel.findOne({ username: credentials.username });
					return user;
				} catch (err) {
					throw new Error('Failed to login');
					// return null;
				}
			},
		}),
	],
	callbacks: {
		async signIn(params: { account: Account | null; profile?: Profile | undefined }) {
			const { account, profile } = params;
      console.log(account, profile)
			if (account && account?.provider === 'github') {
				await dbConnect();
				try {
					const user = await UserModel.findOne({ username: profile?.login });
					if (!user) {
						const newUser = new UserModel({
							username: profile?.login,
							avatar: profile?.avatar_url,
							databases: {
								links: [''],
							},
						});
						await newUser.save();
					}
				} catch (err) {
					console.log(err);
					return false;
				}
			}
			return true;
		},
		async jwt({ token, user, profile }: { token: JWT; user: User | null; profile?: Profile | undefined }) {
			if (user) {
				token._id = user._id;
				token.username = user.username;
				token.password = user.password;
			}
			if (profile) {
				token._id = profile.id;
			}
			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			if (token) {
				session.user.username = token.username;
				session.user.password = token.password;
				session.user._id = token._id;
			}
			return session;
		},
	},
};
