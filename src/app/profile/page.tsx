'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function ProfilePage() {
  const router = useRouter()
  const [data, setData] = useState('Nothing')

  const getUserDetails = async () => {
    const res = await axios.post('/api/users/aboutme')
    console.log(res)
    setData(res.data.data._id)
  }

  const logout = async () => {
    try {
      await axios.get('/api/users/logout')
      toast.success('Logout Success')
      router.push('/login')
    } catch (error: any) {
      console.log('Profile Fetch Failed:', error.response.data.error)
      toast.error(toast.error(error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <p className='text-2xl'>Profile page</p>
      <h2 className="p-1 rounded bg-green-500 mt-2">{data === 'nothing' ? "Nothing" : <Link href={`/profile/${data}`}>{data}
      </Link>}</h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >Logout
      </button>
      <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >Get User Details
      </button>
    </div>
  )
}

export default ProfilePage