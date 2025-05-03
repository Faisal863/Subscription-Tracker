import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.model.js';
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";


export const signUp = async (req, res, next) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {name, email, password} = req.body;

        //check if the user exists already!
        const existingUser  = await User.findOne({email});

        if(existingUser ){
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }
        else {
            //Hash Password
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(password, salt);

            const newuser = await User.create({name, email, password: hashedpassword}, {session});

            const token = jwt.sign({userid: newuser[0].id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

            await session.commitTransaction();
            session.endSession();

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    token,
                    user: newuser[0],

                }
            })
        }
    }
    catch(err){
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
}

export const signIn = async (req, res, next) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({ email });

        if(!user){
            const error = new Error("User does not exist");
            error.statusCode = 404;
            throw error;
        }

        const ispassword = await bcrypt.compare(password,user.password);

        if(!ispassword){
            const error = new Error("Invalid Password");
            error.statusCode = 401;
            throw error;

        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
                user,
            }
        })
    }catch (e) {
        next(e);
    }
}

export const signOut = async (req, res, next) => {

}