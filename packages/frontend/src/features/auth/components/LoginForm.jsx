import React from 'react';
import css from '../styles/Auth.module.css';

const LoginForm = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isValid,
  navigate,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={css.authForm}>
        <div className={css.formGroup}>
          <input
            type="email"
            placeholder="Email"
            {...register('email', {
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Correo electrónico inválido',
              },
            })}
          />
          {errors.email && <span className={css.error}>{errors.email.message}</span>}
        </div>
        <div className={css.formGroup}>
          <input
            type="password"
            placeholder="Contraseña"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 3,
                message: 'La contraseña debe tener al menos 3 caracteres',
              },
            })}
          />
          {errors.password && (
            <span className={css.error}>{errors.password.message}</span>
          )}
        </div>
        <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
        <button type="submit" disabled={!isValid}>
          Iniciar Sesión
        </button>
      </form>
      <div className="separator">
        <span>o inicia sesión con</span>
      </div>
      <div className={css.socialLogin}>
        <button
          className={css.socialLoginOption}
          onClick={() => navigate('/login/weba')}
        >
          WebAsignatura
        </button>
        <button
          className={css.socialLoginOption}
          onClick={() => navigate('/login/autogestion')}
        >
          AutoGestión
        </button>
      </div>
    </>
  );
};

export default LoginForm;
