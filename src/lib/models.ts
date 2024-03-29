import { Schema, model, models } from 'mongoose';

interface IDatabases {
  links: string[]
}

interface IUser {
	username: string;
	password?: string;
  avatar?: string;
  databases: IDatabases;
}

const userSchema = new Schema<IUser>({
	username: { type: String, required: true },
	password: { type: String },
  avatar: { type: String }, 
  databases: { type: Object, required: true },
});

export const UserModel = models.User || model('User', userSchema);