import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async(req, res, next) => {
    try {
        //_________to get accesstoken from req || to get authorization token in header by replacing it with "" wel will get the token -> Authorization : Bearer <token>
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized requesttt"})
        }
    
        const decdedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log("decoded::: ", decdedToken);
        const user = await User.findById(decdedToken?._id).select("-password -refreshToken")
        // console.log(user)
        if (!user) {
            return res.status(401).json({ msg: "Invalid Access token"})
        }
         
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({msg: "Something went wrong while verifying access token"})
    }
};

export const isAdmin = async (req, res, next) => {
    if(req.user && req.user?.role === "Admin"){
        next();
    }else{
        return res.status(401).json({ msg: "Unauthorized Access"})
    }
}