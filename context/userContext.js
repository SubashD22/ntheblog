import axios from 'axios';
import React, {useState,useEffect,useContext,createContext}from 'react';
import { useRouter } from 'next/router';
import {toast} from 'react-hot-toast';

const Context = createContext();
export const UserContext = ({children}) =>{
    const router = useRouter();
    let UserData;
    if(typeof window !== 'undefined'){
        const localUser = localStorage.getItem('user');
        if(localUser !== null){
            UserData = JSON.parse(localUser)
        }
    };
    const [user, setUser]=useState(UserData || null);
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
        if(user){
     localStorage.setItem('user',JSON.stringify(user))}
    },[user])
    const login = async(userdata)=>{
        try {
            setLoading(true)
            const {data} = await axios.post('/api/user/login',userdata);
            if(data){
                setUser(data);
                toast.success('successfully registered');
                router.push('/')
            }
        } catch (error) {
            toast.error(error.response.data || error.message)
        }
    }
    const register = async(userdata)=>{
        try {
            const {data} = await axios.post('/api/user/register',userdata);
            if(data){
                setUser(data);
                toast.success('successfully registered');
                router.push('/')
            }
        } catch (error) {
            if(error.response.data.includes('duplicate key error')){
                toast.error('username already exists, try a different one')
            }else{
            toast.error(error.response.data)};
        }
    };
    const addInfo = async(userData) =>{
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const {data} = await axios.post('/api/user/addinfo',userData,config);
           
            if(data){
                setUser(prevdata => ({
                    ...prevdata,
                    ...data
                }));
                toast.success('successfully registered');
                router.push('/')
            }
        } catch (error) {
            toast.success('successfully registered');
            router.push('/user/addinfo')
        }
    };
    const updateInfo = async(data,type)=>{
        try {
           const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const updateForm = new FormData;
            updateForm.append(`${type}`, data);
            const {data:updatedData} = await axios.put(`/api/user/updateinfo/${user._id}`, updateForm, config);
            if(updatedData){
                setUser(prevdata => ({
                    ...prevdata,
                    ...updatedData
                }));
                toast.success(`successfully updated ${type}`);
            }
        } catch (error) {
            toast.error(error.response.data);
        }
    };
    const deletepost = async(id)=>{
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                }
            }
            const response = await axios.delete(`/api/posts/delete/${id}`,config);
            router.push('/')
        } catch (error) {
            router.push('/')
          
        }
    }
    const logout = ()=>{
        localStorage.removeItem('user');
        setUser(null)
    }
    return(
        <Context.Provider value={{
            user,setUser,login,register,logout,addInfo,updateInfo,deletepost
        }}>
            {children}
        </Context.Provider>
    )
}
export const useUserContext = () => useContext(Context)
