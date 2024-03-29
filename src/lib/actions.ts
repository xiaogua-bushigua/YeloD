'use server';

import dbConnect from './mongodb';
import { UserModel } from './models';
import bcrypt from 'bcryptjs';
import { IStringKeyValueObject } from '@/interfaces';

type LoginResult = {
	success?: boolean;
	error?: string;
};

export const register = async (previousState: any, formData: FormData) => {
	const { username, password, passwordRepeat } = Object.fromEntries(formData) as IStringKeyValueObject;
	if (!username || !password || !passwordRepeat) {
		return { error: 'Please complete the form!' };
	}
	if (password.length < 8) {
		return { error: 'The password length is too short!' };
	}
  if (username.length > 18) {
		return { error: 'The username length is too long!' };
	}
	if (password !== passwordRepeat) {
		return { error: 'Passwords do not match!' };
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	try {
		dbConnect();
		const user = await UserModel.findOne({ username });
		if (user) {
			return { error: 'Username already exists' };
		}
		const newUser = new UserModel({
			username,
			password: hashedPassword,
      databases: {
        links: ['']
      },
		});
        
		await newUser.save();
		console.log('a new user has been saved to db');
		return { success: true };
	} catch (error) {
		console.log(error);
		return { error: 'Something went wrong!' };
	}
};

export const login = async (username: string, password: string): Promise<LoginResult> => {
	try {
		dbConnect();
		const user = await UserModel.findOne({ username });
		if (!user) return { error: 'There is no such user' };
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) return { error: 'Wrong username or password' };
		return { success: true };
	} catch (error) {
    console.log(error);
    return { error: 'Something went wrong!' };
  }
};
