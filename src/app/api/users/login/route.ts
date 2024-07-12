import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest,NextResponse, userAgent} from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

connect()

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json()

        const {email,password} = reqBody

        const findUser = await User.findOne({email})

        if(!findUser){
            return NextResponse.json({error:'User Not Found'},{status:404})
        }

        const validPassword = await bcryptjs.compare(password,findUser.password)

        if(!validPassword){
            return NextResponse.json({error:'Password Incorrect'},{status:400})
        }

        const tokenData = {
            id:findUser._id,
            username:findUser.username,
            email:findUser.email
        }

        const token = jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:'1d'})

        const response = NextResponse.json({
            message:'Log In Success',
            success:true,
        })

        response.cookies.set("token",token,{
            httpOnly:true
        })

        return response

    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}