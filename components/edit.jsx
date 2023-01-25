import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import style from '../styles/write.module.css'
import { FiUpload } from 'react-icons/fi'
import { useRouter } from 'next/router';
import { useUserContext } from '../context/userContext';
import { toast } from 'react-hot-toast';
import cloudinary from 'cloudinary/lib/cloudinary';
import { RotatingLines } from 'react-loader-spinner';
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET
})

const Edit = ({ data, id }) => {
    const { user } = useUserContext();
    const router = useRouter();
    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, []);
    const [iloading, setIloading] = useState(false)
    const [loading, setloading] = useState(false)
    const [postData, setPostData] = useState(
        {
            title: `${data?.title}`,
            image: `${data?.image}`,
            imageId: `${data?.imageId}`
        }
    );
    const [category, setCategory] = useState(data.categories || [])
    const [images, setImages] = useState([]);
    const [value, setValue] = useState(`${data?.text}`);
    const { title, image, imageId } = postData;
    const fileChange = async (e) => {
        const file = e.target.files[0];
        if (imageId === '') {
            setIloading(true)
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET)
            try {
                const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, formData);
                setPostData((prevData) => ({
                    ...prevData,
                    image: res.data.url,
                    imageId: res.data.public_id
                }))
                setIloading(false)
            } catch (error) {
                setIloading(false)
                toast.error('image upload failed')
            }

        } else if (imageId !== '') {
            setIloading(true)
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET)
            try {
                console.log("deleting")
                const delImage = await cloudinary.v2.uploader.destroy(imageId);
                const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, formData);
                setPostData((prevData) => ({
                    ...prevData,
                    image: res.data.url,
                    imageId: res.data.public_id
                }))
                setIloading(false)
            }
            catch (error) {
                setIloading(false)
                toast.error(error.message)
            }
        }
    }
    let categoriesArray = ["fashion", "food", "games", "hobby", "movies", "music", "sports", "story", "travel"];
    const addCategory = (e, c) => {
        e.preventDefault()
        if (!category.includes(c) && category.length < 3) {
            setCategory([...category, c])
        }
    }
    const removeCategory = (e, c) => {
        e.preventDefault();
        const newCategory = category.filter(cat => cat !== c)
        setCategory(newCategory)
    };
    const publish = async (e) => {
        e.preventDefault();
        setloading(true)
        if (!category.length) {
            setloading(false)
            return toast.error('add category')
        }
        if (!value.length) {
            setloading(false)
            return toast.error('add content')
        }
        const formData = {
            title,
            image,
            imageId,
            text: value,
            categories: category,
            images
        }
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }
        try {
            const response = await axios.put(`/api/posts/updatepost/${id}`, formData, config)
            if (response) {
                setloading(false)
                router.push(`/posts/${response.data}`)
            }
        } catch (error) {
            setloading(false)
            toast.error(error.message)
        }

    };
    const quillRef = useRef();
    const imageHandler = (e) => {
        const editor = quillRef.current.getEditor();
        console.log(editor)
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (/^image\//.test(file.type)) {
                console.log(file);
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET)
                console.log(process.env.REACT_APP_CLOUDINARY_PRESET)
                const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`, formData); // upload data into server or aws or cloudinary
                console.log(res)
                const url = res?.data?.url;
                setImages(p => [...p, res.data.public_id])
                editor.insertEmbed(editor.getSelection(), "image", url);
            } else {
                alert('You could only upload images.');
            }
        };
    };
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', "strike"],
                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                { 'indent': '-1' }, { 'indent': '+1' }],
                ['image', "link",],
                [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }]
            ],
            handlers: {
                image: imageHandler
            }
        },
    }), [])
    let dis
    if (loading) {
        dis = true
    } else dis = false
    return (
        <div className='s-content'>

            <form className={style.writeForm} onSubmit={publish}>
                <fieldset style={{ border: 'none' }} disabled={loading}>
                    <div className={style.mainimage}>
                        {iloading ? <RotatingLines
                            strokeColor="grey"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="96"
                            visible={true}
                        /> : <>
                            <label htmlFor='main-image' className={style.upbtn}><FiUpload /></label>
                            <input type="file" name="Image" id="main-image" onChange={fileChange} disabled={dis} />
                            <div className={style.mainimagecontainer}>
                                <img src={postData.image !== '' ? postData.image : data?.image} alt="" />
                            </div>
                        </>}


                    </div>
                    <div className={style.main}>
                        <input type='text' name='Title' value={title} onChange={(e) => { setPostData(p => ({ ...p, title: e.target.value })) }} className={style.maintitle} placeholder='Title' required disabled={dis} />
                    </div>
                    <div className={style.categories}>
                        <div className={style.categorieslist}>
                            <h3>Categories:</h3>
                            {categoriesArray.map((c, i) => (<button key={i} className='drkbtn'
                                onClick={(e) => addCategory(e, c)}>
                                {c}</button>))}
                        </div>
                        <div className={style.selectedcategories}>
                            <h3>Selected Categories:</h3>
                            {category.map((c, i) => (<button key={i} className='drkbtn'
                                onClick={(e) => removeCategory(e, c)}>
                                {c}</button>))}
                        </div>

                    </div>
                    <div className={style.quill}>
                        <ReactQuill ref={quillRef} value={value} name='Text' onChange={setValue} placeholder='content...' modules={modules} />
                    </div>
                    <div style={{
                        marginTop: '10px',
                        zIndex: 999
                    }}>
                        <button className='button28' type='submit'
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>{loading ? <RotatingLines
                                strokeColor="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="50"
                                visible={true}
                            /> : 'Publish'}</button>
                    </div>
                </fieldset>
            </form>

        </div>
    )
}

export default Edit