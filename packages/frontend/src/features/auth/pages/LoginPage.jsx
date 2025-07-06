// src/features/auth/pages/LoginPage.jsx
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../shared/context/AuthContext';
import LoginForm from '../components/LoginForm';
import authCSS from '../styles/Auth.module.css';
import { useNavigate } from 'react-router-dom';
import BasePage from './BasePage';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onChange',
    });

    const onSubmit = async (data) => { // Hacemos la función asíncrona
        try {
            // *** CAMBIO CRÍTICO AQUÍ ***
            // Usar data.ci y data.credencial según los campos del formulario
            await login(data.ci, data.credencial); // data.ci y data.credencial
            navigate('/inicio'); // Redirige a /inicio si el login fue exitoso
        } catch (error) {
            // El error ya se maneja en el AuthContext con `toast.error`
            // Aquí no necesitamos hacer nada más.
            console.error("Login attempt failed in LoginPage:", error);
        }
    };

    return (
        <BasePage>
            <div className={`formWrapper ${authCSS.formAuthWrapper}`}>
                <LoginForm
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    errors={errors}
                    isValid={isValid}
                    // navigate={navigate} // Ya no es necesaria esta prop en LoginForm
                />
            </div>
        </BasePage>
    );
};

export default LoginPage;