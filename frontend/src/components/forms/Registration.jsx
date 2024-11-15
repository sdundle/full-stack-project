import { Form, redirect, useActionData, useSubmit } from "react-router-dom";
import './form.css';
import Input from "./FormElements/Input";
import Label from "./FormElements/Label";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Loader, Placeholder } from "rsuite";
import { backendBaseUrl } from "../util/Auth";

export default function Registration() {    

    const data = useActionData();
    const [load, setLoad] = useState(false);


    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    let watchPassword = watch('password');

    let submit = useSubmit();

    const onSubmit = (data) => { setLoad(true); submit(new FormData(event.target), { method: "post", action: action }) }

    useEffect(() => {
        setLoad(false);
    }, [data]);

    useEffect(() => {
        document.title = 'Registration';
      }, []);

    return (
        <>
            {!load ?
                <Form method="POST" className="form-class" onSubmit={handleSubmit(onSubmit)}>
                    <h1>Register User</h1>
                    {!data?.errors &&
                        <><br />{data?.message &&
                            <div className="success-msg">
                                <i className="fa fa-check"></i>
                                {data.message}
                            </div>}
                        </>
                    }
                    {data?.errors &&
                        <>
                            {
                                data?.errors?.message &&
                                <div className="error-msg">
                                    <i className="fa fa-times-circle"></i>
                                    {data.errors.message}
                                </div>
                            }
                        </>
                    }
                    <div className="container">
                        <Label htmlFor="email">Your Email</Label>
                        <input type="email" name="email" {...register("email", { required: true, min: 2, maxLength: 40, pattern: /^[^@]+@[^@]+\.[^@]+$/i })} className={errors.email ? "error" : null} aria-invalid={errors.email ? "true" : "false"} placeholder="Enter email" />
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
                        <input type="text" name="name" {...register("name", { required: true, minLength: 2, maxLength: 40 })} className={errors.name ? "error" : null} aria-invalid={errors.name ? "true" : "false"} placeholder="Enter name" />
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
                        <input type="password" name="password" {...register("password", { required: true, minLength: 4, maxLength: 40 })} className={errors.password ? "error" : null} aria-invalid={errors.password ? "true" : "false"} placeholder="Enter password" />
                        {errors.password?.type === "required" && (
                            <><div className="error-message">Password is required</div><br /><br /></>
                        )}
                        {errors.password?.type === "minLength" && (
                            <><div className="error-message">Please enter password of minimum four characters</div><br /><br /></>
                        )}
                        {data?.errors?.password &&
                            <><div className="error-message">{data.errors.password[0]}</div><br /><br /></>
                        }
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <input type="password" name="confirm_password"  {...register("confirm_password", {
                            validate: value => value === watchPassword || "The passwords do not match"
                        })} className={errors.password ? "error" : null} aria-invalid={errors.password ? "true" : "false"} placeholder="Cofirm password" />
                        {errors.confirm_password && <><div className="error-message">{errors.confirm_password.message}</div><br /></>}
                    </div>
                    <div className="container">
                        <button className="submit-button">
                            Register
                        </button>
                    </div>
                </Form> : <><Placeholder.Paragraph rows={8} />
                <Loader backdrop content="loading..." vertical /></>
            }
        </>
    );
}

export async function action({ request, params }) {

    const data = await request.formData();
    const registrationData = {
        email: data.get('email'),
        password: data.get('password'),
        password_confirmation: data.get('confirm_password'),
        name: data.get('name')
    }

    const response = await fetch(`${backendBaseUrl}/api/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(registrationData)
    });

    const res = await response.json();

    if (response.ok) {
        return redirect('/login');
    }

    return res;
}