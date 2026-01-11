import React, { useState, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input, Button, Alert } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Login</h2>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const result = await login(values.email, values.password);
          if (result.success) {
            navigate(`/${result.user.role}`);
          } else {
            setError(result.error);
          }
          setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: 16 }}>
              <Field name="email" as={Input} placeholder="Email" />
              {errors.email && touched.email && <div style={{ color: 'red' }}>{errors.email}</div>}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field name="password" type="password" as={Input} placeholder="Password" />
              {errors.password && touched.password && <div style={{ color: 'red' }}>{errors.password}</div>}
            </div>
            <Button type="primary" htmlType="submit" loading={isSubmitting} block>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;