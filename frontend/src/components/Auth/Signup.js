import React, { useState, useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input, Button, Alert } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(20, 'Too short').max(60, 'Too long').matches(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, spaces').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Too short').max(16, 'Too long').matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'Must contain uppercase and special char').required('Required'),
  address: Yup.string().max(400, 'Too long'),
});

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Signup</h2>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      {success && <Alert message={success} type="success" showIcon style={{ marginBottom: 16 }} />}
      <Formik
        initialValues={{ name: '', email: '', password: '', address: '' }}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const result = await signup(values.name, values.email, values.password, values.address);
          if (result.success) {
            setSuccess('Account created successfully! Please login.');
            resetForm();
          } else {
            setError(result.error);
          }
          setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: 16 }}>
              <Field name="name" as={Input} placeholder="Name (20-60 chars)" />
              {errors.name && touched.name && <div style={{ color: 'red' }}>{errors.name}</div>}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field name="email" as={Input} placeholder="Email" />
              {errors.email && touched.email && <div style={{ color: 'red' }}>{errors.email}</div>}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field name="password" type="password" as={Input} placeholder="Password (8-16 chars, uppercase + special)" />
              {errors.password && touched.password && <div style={{ color: 'red' }}>{errors.password}</div>}
            </div>
            <div style={{ marginBottom: 16 }}>
              <Field name="address" as={Input.TextArea} placeholder="Address (max 400 chars)" />
              {errors.address && touched.address && <div style={{ color: 'red' }}>{errors.address}</div>}
            </div>
            <Button type="primary" htmlType="submit" loading={isSubmitting} block>
              Signup
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;