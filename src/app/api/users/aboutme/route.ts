import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest,NextResponse} from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'
import { getDataFromToken } from '@/helpers/dataFromToken'

connect()

export async function POST(request:NextRequest){
    try {
        const userId = await getDataFromToken(request)

        const user = await User.findOne({_id:userId}).select("-password")

        if(!user){
            return NextResponse.json({error:'User Not Found'},{status:404})
        }

        return NextResponse.json({
            data:user,
            message:'User Data Found',
            success:true
        })

    } catch(error:any){
        return NextResponse.json({error:error.message},{status:500})
    }
}