import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authHelper.mjs";
import userModel from "../models/userModel.mjs"


export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        //validation
        if (!name) {
            return res.send({ error: 'Name is required' })
        }
        if (!email) {
            return res.send({ error: 'Email is required' })
        }
        if (!password) {
            return res.send({ error: 'Password is required' })
        }
        // if (!phone) {
        //     return res.send({ error: 'Phone is required' })
        // }
        // if (!address) {
        //     return res.send({ error: 'Adress is required' })
        // }
        //check users
        const existingUser = await userModel.findOne({ email })
        //existing user
        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: 'Already Rgister please log in',
            })
        }
        //register user
        const hashedpassword = await hashPassword(password)
        //save
        const user = await new userModel({ name, email, phone, address, password: hashedpassword }).save()

        res.status(201).send({
            success: true,
            message: 'User Register Succesfully',
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in registration',
            error
        })
    }
}
//post login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or paswword'
            })
        }
        //cehck user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not register'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid password'
            })
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d', })
        res.status(200).send({
            success: true,
            message: 'LogIn Successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

//test controller
export const testController = (req, res) => {
    try {
        res.send("protected routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }

}

