import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../shared/context/AuthContext';
import LoginForm from '../components/LoginForm';
import authCSS from '../styles/Auth.module.css';
import { useNavigate } from 'react-router-dom';
import BasePage from './BasePage';
import AuthChip from '../components/AuthChip';

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

  const onSubmit = (data) => {
    login(data.email, data.password);
  };

  return (
    <BasePage>
      <div className={`formWrapper ${authCSS.formAuthWrapper}`}>
        <img src="/ColdUCU.svg" alt="Cold UCU" className={authCSS.logo} />
        <LoginForm
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          isValid={isValid}
          navigate={navigate}
        />
      </div>
      <AuthChip
        title="¿No tenés cuenta?"
        action="Comunicate a soporte@ucu.com"
        redirect="https://www.ucu.edu.uy/"
      />
    </BasePage>
  );
};

export default LoginPage;
