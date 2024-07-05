import jwt from "jsonwebtoken";
const secret=process.env.JWT_SECRET || "mnbvcxza479";
const token=(id)=>{
    console.log(secret);
    const token1= jwt.sign({id:id},secret,{expiresIn:'2d'})
    console.log(token1);
    return token1;
}
export {token}