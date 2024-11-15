import { Form, redirect, useActionData, useSubmit } from 'react-router-dom';
import { backendBaseUrl, setAuthToken } from '../util/Auth';
import './form.css'
import Input from './FormElements/Input';
import Label from './FormElements/Label';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Loader, Placeholder } from 'rsuite';

export default function Login() {


    const data = useActionData();
    const [load, setLoad] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();


    let submit = useSubmit();

    const onSubmit = (data) => { setLoad(true); submit(data, { method: "post", action: action }) };

    useEffect(() => {
        setLoad(false);
    }, [data]);

    useEffect(() => {
        document.title = 'Login Form';
      }, []);

    return (
        <>
            {!load ?
                <Form method="POST" className="form-class" onSubmit={handleSubmit(onSubmit)}>
                    <h1>Login Form</h1>
                    {!data?.errors &&
                        <>{data?.message &&
                            <div className="success-msg">
                                <i className="fa fa-check"></i>
                                {data.message}
                            </div>}
                        </>
                    }
                    {data?.errors &&
                        <>
                            <br />
                            <div className="error-msg">
                                <i className="fa fa-times-circle"></i>
                                {data.errors.message}
                            </div>
                        </>
                    }
                    <div className="container">
                        <Label htmlFor="email">Email address</Label>
                        <input type="email" name="email" placeholder="Enter email" {...register("email", { required: true, min: 2, maxLength: 40, pattern: /^[^@]+@[^@]+\.[^@]+$/i })} className={errors.email ? "error" : null} aria-invalid={errors.email ? "true" : "false"} />
                        {errors.email?.type === "required" && (
                            <><div className="error-message">Email is required</div><br /><br /></>
                        )}
                        {errors.email?.type === "pattern" && (
                            <><div className="error-message">Please enter valid email</div><br /><br /></>
                        )}
                        {data?.errors?.email &&
                            <><div className="error-message">{data.errors.email[0]}</div><br /><br /></>
                        }
                        <Label htmlFor="password">Password</Label>
                        <input type="password" name="password" placeholder="Enter Password"  {...register("password", { required: true, min: 2, maxLength: 40 })} className={errors.password ? "error" : null} aria-invalid={errors.email ? "true" : "false"} />
                        {errors.password?.type === "required" && (
                            <><div className="error-message">Password is required</div><br /></>
                        )}
                        {errors.password?.type === "min" && (
                            <><div className="error-message">Please enter password of minimum length two</div><br /></>
                        )}
                        {data?.errors?.password &&
                            <><div className="error-message">{data.errors.password[0]}</div><br /></>
                        }
                    </div>

                    <div className="container" >
                        <button className='submit-button'>
                            login
                        </button>
                    </div>
                </Form> :
                <>
                    <Placeholder.Paragraph rows={8} />
                    <Loader backdrop content="loading..." vertical />
                </>
            }
        </>
    );
}

export async function action({ request, params }) {
    const data = await request.formData();
    const loginData = {
        email: data.get('email'),
        password: data.get('password')
    }

    const response = await fetch(`${backendBaseUrl}/api/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(loginData)
    });

    const res = await response.json();
    if (response.ok) {
        setAuthToken(res);
        return redirect('/home');
    }

    return res;
}