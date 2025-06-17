const User = require('../models/User');
const bcrypt = require('bcryptjs');


//register controller
//register a new user need to hash password
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body

        //check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists. Please login instead.' });
        }

        //hash password with bcryptjs
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create new user
        const newUser = new User({ username, email, password: hashedPassword, role });
        console.log(`New user created: ${newUser}`);
        
       if (newUser) {
            await newUser.save();
            return res.status(201).json({ 
                success: true,
                message: 'User registered successfully',
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role
                }
            });
        } else {
            return res.status(400).json({ 
                success: false,
                message: 'User registration failed' 
            });
        }
    } catch (error) {
        console.error(`Error in registerUser: ${error.message}`);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//login controller 
//login a user need jsonwebtoken
const loginUser = async (req, res) => {
    try {
            
            
        const {username, password} = req.body;

        //check if user exists in database
        const user = await User.findOne({username})

        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please register first.' 
            });
        }

        //if password is correct or not
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Password. Please try again.'
            })
        }

        //if login is successful, generate a token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('token generated successfully', token);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            accessToken: token
        })
        

    }catch (error) {
        console.error(`Error in loginUser: ${error.message}`);
        res.status(500).json({ 
            success: false,
            message: 'Internal Server Error' 
        });
    }
}


//change password
const changePassword = async (req,res) => {
    try{
        const userId = req.userInfo.id
        
        //req.body return undefined
        console.log('You received body data....................',req.body);
        

        //extract old and new password
        const {oldPassword, newPassword} = req.body;
        console.log(oldPassword);
        console.log(newPassword);
        
        

        //find current login user
        const user = await User.findById(userId);

        if(!user) {
            return res.status(200).json({
                    success: false,
                    message: 'User not found'
            })
        }

        //if oldpassword is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)

        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is not correct! Please try again"
            })
        }

        //hash new password here
        const salt =await bcrypt.genSalt(10)
        const newHashedPassword = await bcrypt.hash(newPassword,salt)

        //update user password
        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "You changed your password successfully "
        })

    }catch(error) {
        console.error(`Error in Password Changin: ${error.message}`);
        res.status(500).json({ 
            success: false,
            message: 'Error in password Changing' 
        });
    }
}
module.exports = { registerUser, loginUser,changePassword };