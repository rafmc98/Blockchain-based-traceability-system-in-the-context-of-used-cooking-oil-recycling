import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./LogIn.css";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const { t } = useTranslation();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/auth";
			const { data: res } = await axios.post(url, data);
			sessionStorage.setItem("token", res.data.token);
			sessionStorage.setItem("name", res.data.name);
			sessionStorage.setItem('email', res.data.email);
			//window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className='login-container'>
			<div className='login-form-container'>

				<div className='left'>
					<form className='form-container' onSubmit={handleSubmit}>
						<p>Login</p>
						<input type="email" placeholder="Email" name="email" onChange={handleChange} value={data.email} required/>
						<input type="password" placeholder="Password" name="password" onChange={handleChange} value={data.password} required/>
						{error && <div className='error-msg'>{error}</div>}
						<button type="submit" className='login-button'>
							{t('login')}
						</button>
					</form>
				</div>

				<div className='right'>
					<p>{t('new_user')}</p>
					<Link to="/signup">
						<button type="button" className='signup-button'>
							{t('signup')}
						</button>
					</Link>
				</div>

			</div>
		</div>
	);
};

export default Login;
