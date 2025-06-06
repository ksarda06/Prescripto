import { createContext, useEffect } from "react"
import { useState } from "react"
import axios from 'axios'
import { toast } from "react-toastify"
export const AppContext=createContext()
const AppContextProvider=(props)=>{
    axios.defaults.withCredentials=true
    const currencySymbol='Rs.'
    const [doctors,setDoctors]=useState([])
    const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
    const [userData,setUserData]=useState(localStorage.getItem('token')?true:false)
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const getAuthState=async()=>{
        try{
            const {data}=await axios.get(backendUrl+'/api/user/is-auth')
            if(data.success){
                loadUserProfileData();
            }
        }
        catch(err){
            toast.error(err.message)
        }
    }
    const getDoctorsData=async()=>{
        try{
            const {data}=await axios.get(backendUrl+'/api/doctor/list')
            if(data.success){
                setDoctors(data.doctors)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(err){
            console.log(err)
            toast.error(err.message)

        }
    }
    const loadUserProfileData=async()=>{
        try{
            const {data}=await axios.get(backendUrl+'/api/user/my-profile',{headers:{token}})
            console.log(data)
            console.log("user Profile")
            if(data.success){
                setUserData(data.userData)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(err){
            console.log(err)
            toast.error(err.message)
        }
    }
    const value={
        doctors,getDoctorsData,currencySymbol,token,setToken,backendUrl,userData,setUserData,loadUserProfileData
    }
    useEffect(()=>{
        getDoctorsData()
    },[])
    useEffect(()=>{
        if(token){
            loadUserProfileData()
        }
        else{
            setUserData(false)
        }
    },[token])
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>

    )
}
export default AppContextProvider
