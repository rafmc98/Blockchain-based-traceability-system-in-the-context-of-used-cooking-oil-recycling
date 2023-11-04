import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../LogIn/LogIn.css"
import "./SignUp.css";


const Signup = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const { t } = useTranslation();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/users";
			const { data: res } = await axios.post(url, data);
			navigate("/login");
			console.log(res.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				console.log(error.response.data.publicKey);
				setError(error.response.data.message);
			}
		}
	};

	return (
		<div className='signup-container'>
			<div className='signup-form-container'>
				<div className='left'>
					<p>{t('welcomeBack')}</p>
					<Link to="/login">
						<button type="button" className='login-button'>
							{t('login')}
						</button>
					</Link>
				</div>
				<div className='right'>
					<form className='form-container' onSubmit={handleSubmit}>
						<p>{t('createAccount')}</p>
						<input type="text" placeholder={t('firstName')} name="firstName" onChange={handleChange} value={data.firstName} required />
						<input type="text" placeholder={t('lastName')} name="lastName" onChange={handleChange} value={data.lastName} required />
						<input type="email" placeholder="Email" name="email" onChange={handleChange} value={data.email} required />
						<input type="password" placeholder="Password" name="password" onChange={handleChange} value={data.password} required />
						{error && <div className='error-msg'>{error}</div>}
						<button type="submit" className='signup-button'>
							{t('signup')}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Signup;