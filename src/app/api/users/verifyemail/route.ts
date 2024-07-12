import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest,NextResponse, userAgent} from 'next/server'

connect()

export async function POST(request:NextRequest){
    try{
        const reqBody = await request.json()

        const {token} = reqBody

        const findUser = await User.findOne({verifyToken:token,verifyTokenExpiry:{$gt:Date.now()}})

        if(!findUser){
            return NextResponse.json({error:'User Not Found'},{status:404})
        }

        findUser.isVerified = true
        findUser.verifyToken = undefined
        findUser.verifyTokenExpiry = undefined

        await findUser.save()

        return NextResponse.json({
            message:'User verified',
            success:true,
            findUser
        })

    } catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}