import { Form, redirect, useActionData, useLoaderData, useSubmit } from "react-router-dom";
import Label from "./FormElements/Label";
import Input from "./FormElements/Input";
import { backendBaseUrl, getAuthToken } from "../util/Auth";
import { useForm } from "react-hook-form";
import { Col, Grid, Loader, Message, Placeholder, Row, useToaster } from "rsuite";
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
    
    const loaderData = useLoaderData();

    const onSubmit = () => { setLoad(true); submit(new FormData(event.target), { method: "post", action: action }) };

    useEffect(() => {
        setLoad(false);
    }, [data]);

    useEffect(() => {
        document.title = 'User Profile';
    }, []);

    return (
        <>
            {!load ?

                <Grid fluid>
                    <Form method="POST" className="form-class" onSubmit={handleSubmit(onSubmit)}>
                        <h1 ref={scrollTo}>Welcome {loaderData.name}</h1>
                        {!data?.errors &&
                            <>
                                {data?.message &&
                                    <Message showIcon type="success" closable>
                                        <strong>{data.message}</strong>
                                    </Message>
                                }
                                <Row className="show-grid">
                                    <Col xs={24} sm={24} md={12}>
                                        <div className="container">
                                            <Label htmlFor="email">Your Email</Label>
                                            <input type="email" defaultValue={loaderData ? loaderData.email : ''} name="email" placeholder="Enter email" disabled="disabled" />
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
                                            <input type="password" name="password" {...register("password", { minLength: 4, maxLength: 40 })} className={errors.password ? "error" : null} aria-invalid={errors.password ? "true" : "false"}  placeholder="Enter password" />
                                            {errors.password?.type === "minLength" && (
                                                <><div className="error-message">Please enter password of minimum four characters</div><br /><br /></>
                                            )}
                                            {data?.errors?.password &&
                                                <><div className="error-message">{data.errors.password[0]}</div><br /><br /></>
                                            }
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                        <div className="container">
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
                                    </Col>
                                </Row>
                                <button className="profile-button">
                                    Update Details
                                </button>
                            </>
                        }
                    </Form>
                </Grid>
                : <><Placeholder.Paragraph rows={8} />
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
    const response = await fetch(`${backendBaseUrl}/api/user/profile`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    const res = await response.json();
    localStorage.setItem('user', JSON.stringify(res.message.user));
    return res.message.user;
}


export async function action({ request, params }) {

    const token = getAuthToken();
    const data = await request.formData();

    const updateData = {
        password: data.get('password'),
        name: data.get('name'),
        api_data_source: data.get('api_data_source'),
        category: data.get('category'),
        author: data.get('author')
    }

    const response = await fetch(`${backendBaseUrl}/api/user/profile`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
    })
    const res = await response.json();
    if (response.ok) {
        return { message: res.message };
    }
    return res;

}