import jwt from "jsonwebtoken";
const secret=process.env.REFRESH_TOKEN_SECRET || "mnbvcza479";

const generateRefreshtoken=(id)=>{

    console.log(secret)
    const token= jwt.sign({id:id},secret,{expiresIn:'1d'})
    console.log(token);
    return token;
}
export {generateRefreshtoken};