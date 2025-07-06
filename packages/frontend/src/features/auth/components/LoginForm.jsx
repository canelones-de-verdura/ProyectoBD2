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
      <h2>Presidente de la mesa inicie sesión</h2>
        <div className={css.formGroup}>
          <input
            type="text"
            placeholder="Credencial"
            {...register('credencial', {
              required: 'La credencial es obligatoria',
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
        <button type="submit" disabled={!isValid}>
          Iniciar Sesión
        </button>
      </form>
    </>
  );
};

export default LoginForm;
