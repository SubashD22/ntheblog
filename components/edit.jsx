import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import style from '../styles/write.module.css'
import { FiUpload } from 'react-icons/fi'
import { useRouter } from 'next/router';
import { useUserContext } from '../context/userContext';
import { toast } from 'react-hot-toast';

const Edit = ({ data, id }) => {
    const { user } = useUserContext();
    const router = useRouter();
    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, []);
    const [loading, setloading] = useState(false)
    const [postData, setPostData] = useState(
        {
            Title: `${data?.title}`,
            Image: '',
        }
    );
    const [category, setCategory] = useState(data.categories || [])
    const [images, setImages] = useState([]);
    const [value, setValue] = useState(`${data?.text}`);
    const { Title, Image } = postData;
    const mainOnchange = (e, type) => {
        const value = type === 'image' ? e.target.files[0] : e.target.value

        setPostData((prevData) => ({
            ...prevData,
            [e.target.name]: value
        }))
    };
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
        if (!category.length) {
            return toast.error('add category')
        }
        const formData = new FormData
        for (let key in postData) {
            formData.append(key, postData[key])
        }
        formData.append('Text', value)
        category.forEach(c =>
            formData.append('Categories', c)
        )
        formData.append('Images', images)
            ;
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }
        const response = await axios.put(`/api/posts/updatepost/${id}`, formData, config)
        if (response) {
            router.push(`/posts/${response.data}`)
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
                <div className={style.mainimage}>
                    <label htmlFor='main-image' className={style.upbtn}><FiUpload /></label>
                    <input type="file" name="Image" id="main-image" onChange={(e) => mainOnchange(e, 'image')} disabled={dis} />
                    <div className={style.mainimagecontainer}>
                        <img src={postData.Image !== '' ? URL.createObjectURL(postData.Image) : data?.image} alt="" />
                    </div>

                </div>
                <div className={style.main}>
                    <input type='text' name='Title' value={Title} onChange={(e) => mainOnchange(e, 'string')} className={style.maintitle} placeholder='Title' required disabled={dis} />
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
                    <button type='submit' className='button28' disabled={dis}>Publish</button>
                </div>

            </form>

        </div>
    )
}

export default Edit