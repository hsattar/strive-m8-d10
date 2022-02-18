import { Model } from 'mongoose'

export interface IUser {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface UserModel extends Model<IUser> {
    authenticate(email: string, password: string): IUser | null
  }