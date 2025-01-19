import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
    const { name, email, userName, password, role } = req.body;
    if ([name, email, userName, password].some(field => field?.trim() === "")) {
        // return res.status(400).json({ msg: "All fields are required!!"})
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{userName}, {email}]
    });
    if (existedUser) {
        // return res.status(409).json({ msg: "Attempting to register a user with a username or email tghat already exists!!!"})
        throw new ApiError(409, "Attempting to register a user with a username or email that already exists!!")
    }

    const user = await User.create({
        name,  
        email,
        userName,
        password,
        role
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        // return res.status(500).json({ msg: "Something went wrong while registering the user!!  :("})
        throw new ApiError(500, "Something went wrong while registering the user!!  :(")
    }

    return res.status(201).json(
        // {
        //     createdUser,
        //     msg: "User has been registered successfullyyy  :)"
        // }
        new ApiResponse(201, createdUser, "User has been registered Successfully")
    )
};

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // console.log("The ACT is:",accessToken)
        // console.log("The RFT is:",refreshToken)

        // this is to save in the user db.
        user.refreshToken = refreshToken;
        // validateBeforeSave will tell that dont validate it, directly save it.
        await user.save({ validateBeforeSave: true});

        return { accessToken, refreshToken }

    } catch (error) {
        // return res.status(500).json({ msg: "Something went wrog while generating access abnd refresh token :("})
        throw new ApiError(500, "Something went wrong while generating access and refresh token :(")
    }
}

const loginUser = async (req, res) => {

    const { userName, email, password } = req.body;
    if (!(!userName || !email )) {
        // return res.status(400).json({ msg: "Username or email is required"})
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{userName}, {email}]
    });
    if (!user) {
        // return res.status(404).json({ msg: "User not found, this user does not exists"})
        throw new ApiError(404, "User not found, this user does not exists")
    }
    // console.log(user)
    const isPasswordValid = await user.isPasswordCorrect(password);
    // console.log(isPasswordValid)
    if (!isPasswordValid) {
        // return res.status(401).json({ msg: "Invalid password or credentials"})
        // throw new ApiError(401, "Invalid password or credentials")
        return res.status(401).json( new ApiError( 401, "Invalid password or credentials"))
    };

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const userToLogin = await User.findById(user._id).select("-password -refreshToken")
    if (!userToLogin) {
        // return res.status(401).json({ msg: "Something went wrong while logging in" })
        throw new ApiError(401, "Something went wrong while logging in")
    }

    // this tells that the cookies are sent over secure connectuions
    const options = {
        httpsOnly: true, // this prevents frontend from accessing cookie
        secure: true // this makes sure ke cookie sirf secure env se transmit horhi hai
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        // {
        // msg: "User has logged in successfully",
        // userToLogin,
        // refreshToken,
        // accessToken
        // }
        new ApiResponse(200, {user: userToLogin, refreshToken, accessToken}, "User has logged in successfully")
    )
};

const logOutUser = async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this will remove the field from the document
            }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        // {
        // msg: "User logged out successfully"
        // }
        new ApiResponse(200, {}, "User logged Out")
    )
}

const updateUserDetails = async (req, res) => {
    const { name, email, userName } = req.body; 
    if (![name, email, userName].every(field => field?.trim() !== "")) {
        throw new ApiError(400, "All fields are required.");
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ userName }, { email }]
        });

        if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
            throw new ApiError(409, "Username or email already in use.");
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    name,
                    email,
                    userName,
                }
            },
            { new: true }
        )
        if (!updatedUser) {
            throw new ApiError(500, "Something went wrong while updating the user details.");
        }

        return res.status(200).json(
            new ApiResponse(200, updatedUser, "User details updated successfully.")
        );

    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating the user details.");
    }
}

const getNewAccessToken = async (req, res) => {}

export {
    registerUser,
    loginUser,
    logOutUser,
    updateUserDetails,
    getNewAccessToken,

};