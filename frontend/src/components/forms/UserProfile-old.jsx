import { Form, redirect, useActionData, useLoaderData, useSubmit } from "react-router-dom";
import Label from "./FormElements/Label";
import Input from "./FormElements/Input";
import { getAuthToken } from "../util/Auth";
import { useForm } from "react-hook-form";
import { Loader, Message, Placeholder, useToaster } from "rsuite";
import { useEffect, useState } from "react";

export default function UserProfile() {

    const [load, setLoad] = useState(false);

    const toaster = useToaster();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    let submit = useSubmit();

    const data = useActionData();
    const loaderData = useLoaderData(); // JSON.parse(localStorage.getItem('user'));

    const onSubmit = () => { setLoad(true); submit(new FormData(event.target), { method: "post", action: action }) };

    useEffect(() => {
        setLoad(false);
    }, [data]);

    return (
        <>
            {!load ?
                <Form method="POST" className="form-class" onSubmit={handleSubmit(onSubmit)}>
                    <h1 ref={scrollTo}>Welcome {loaderData.name}</h1>
                    {!data?.errors &&
                        <>{data?.message &&
                            <Message showIcon type="success" closable>
                                <strong>{data.message}</strong>
                            </Message>
                        }
                        </>
                    }
                    <div className="container">
                        <Label htmlFor="email">Your Email</Label>
                        <input type="email" defaultValue={loaderData ? loaderData.email : ''} name="email" {...register("email", { required: true, min: 2, maxLength: 40, pattern: /^[^@]+@[^@]+\.[^@]+$/i })} className={errors.email ? "error" : null} aria-invalid={errors.email ? "true" : "false"} placeholder="Enter email" />
                        {errors.email?.type === "required" && (
                            <><div className="error-message">Email is required</div><br /><br /></>
                        )}
                        {errors.email?.type === "pattern" && (
                            <><div className="error-message">Please enter valid email</div><br /><br /></>
                        )}
                        {data?.errors?.email &&
                            <><div className="error-message">{data.errors.email[0]}</div><br /><br /></>
                        }
                        <Label htmlFor="name">Your Name</Label>
                        <input type="text" defaultValue={loaderData ? loaderData.name : ''} name="name" {...register("name", { required: true, minLength: 2, maxLength: 40 })} className={errors.name ? "error" : null} aria-invalid={errors.name ? "true" : "false"} placeholder="Enter name" />
                        {errors.name?.type === "required" && (
                            <><div className="error-message">Name is required</div><br /><br /></>
                        )}
                        {errors.name?.type === "minLength" && (
                            <><div className="error-message">Please enter name of minimum two characters</div><br /><br /></>
                        )}
                        {data?.errors?.name &&
                            <><div className="error-message">{data.errors.name[0]}</div><br /><br /></>
                        }
                        <Label htmlFor="password">Your Password</Label>
                        <Input type="password" name="password" placeholder="Enter password" />
                        <Label htmlFor="api_data_source">API Sources</Label>
                        <select className="data-source-select" name="api_data_source" defaultValue={loaderData.feed.api_data_source_url} {...register("api_data_source")} aria-invalid={errors.api_data_source ? "true" : "false"}>
                            {loaderData.apiList && loaderData.apiList.map((list) => (
                                <option value={list.api_data_source_key_url} key={list.api_data_source_key_url}>{list.api_data_source_name}</option>
                            ))}
                        </select><br />
                        <Label htmlFor="category">Category</Label>
                        <input type="text" defaultValue={loaderData.feed.category} name="category" placeholder="Enter Category" /><br />
                        <Label htmlFor="author">Author</Label>
                        <input type="text" name="author" placeholder="Enter Author" />
                    </div>
                    <div className="container">
                        <button className="submit-button">
                            Update Details
                        </button>
                    </div>
                </Form> : <><Placeholder.Paragraph rows={8} />
                    <Loader backdrop content="loading..." vertical /></>
            }
        </>
    );
}

export async function loader() {


    const token = getAuthToken();

    if (!token) {
        return redirect('/login');
    }
    const response = await fetch('http://localhost:8000/api/user/profile', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    const res = await response.json();
    localStorage.setItem('user', JSON.stringify(res.message.user));
    console.log(res);
    return res.message.user;
}


export async function action({ request, params }) {

    const token = getAuthToken();
    const data = await request.formData();

    const updateData = {
        email: data.get('email'),
        password: '',
        name: data.get('name'),
        api_data_source: data.get('api_data_source'),
        category: data.get('category'),
        author: data.get('author')
    }

    const response = await fetch('http://localhost:8000/api/user/profile', {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
    })
    const res = await response.json();
    console.log(res);
    console.log(response);
    if (response.ok) {
        return { message: res.message };
    }
    return res;

}