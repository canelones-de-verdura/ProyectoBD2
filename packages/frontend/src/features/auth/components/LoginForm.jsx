// src/features/auth/components/LoginForm.jsx
import React from 'react';
import css from '../styles/Auth.module.css';

const LoginForm = ({
    register,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
}) => {
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={css.authForm}>
                <h2>Presidente de la mesa inicie sesión</h2>
                <div className={css.formGroup}>
                    <input
                        type="number" // Cambiar a tipo number si ci es un número
                        placeholder="Cédula de Identidad (CI)"
                        {...register('ci', { // Campo 'ci'
                            required: 'La cédula de identidad es obligatoria',
                            pattern: { // Opcional: validación de formato de CI
                                value: /^\d{8}$/, // 8 dígitos
                                message: 'La CI debe tener 8 dígitos numéricos'
                            }
                        })}
                    />
                    {errors.ci && <span className={css.error}>{errors.ci.message}</span>}
                </div>
                <div className={css.formGroup}>
                    <input
                        type="text" // 'credencial' puede ser alfanumérico
                        placeholder="Credencial"
                        {...register('credencial', { // Campo 'credencial'
                            required: 'La credencial es obligatoria',
                            minLength: {
                                value: 3,
                                message: 'La credencial debe tener al menos 3 caracteres',
                            },
                        })}
                    />
                    {errors.credencial && (
                        <span className={css.error}>{errors.credencial.message}</span>
                    )}
                </div>
                <button type="submit" disabled={!isValid}>
                    Iniciar Sesión
                </button>
            </form>
        </>
    );
};

export default LoginForm;