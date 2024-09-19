/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Button, TextField, Grid, MenuItem, CardHeader, Divider } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/Redux/Store';
import { updateUser, fetchUsers } from '@/Redux/Auth/userSlice';
//import { User } from '@/Utils/dataTypes';

// Validation schema using Yup
const validationSchema = Yup.object({
  nom: Yup.string().required('Nom est requis'),
  postnom: Yup.string().required('Postnom est requis'),
  prenom: Yup.string().required('Prénom est requis'),
  numero: Yup.string().required('Numéro est requis'),
  role: Yup.string().oneOf(['Vendeur', 'Admin', 'SuperAdmin']).required('Rôle est requis'),
});

interface UserFormProps {
  user: any;
}

const UserForm: React.FC<UserFormProps> = ({ user }) => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <><CardHeader subheader="The information can be edited" title="Profile" className='bg-gray-50'/><Divider /><Formik
          initialValues={{
            //@ts-ignore
              nom: user.nom,
              //@ts-ignore
              postnom: user.postnom,
              //@ts-ignore
              prenom: user.prenom,
              //@ts-ignore
              numero: user.numero,
              //@ts-ignore
              password: '',
              //@ts-ignore
              role: user.role,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
              const data = {
                  nom: values.nom,
                  postnom: values.postnom,
                  prenom: values.prenom,
                  numero: values.numero,
                  password: values.password,
                  role: values.role,
              };
              //@ts-ignore
              dispatch(updateUser({ id: user._id, user: data })).then(() => {
                  dispatch(fetchUsers());
              });
          } }
      >
          {({ errors, touched }) => (
              <Form style={{ padding: '24px' }}>
                  <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                          <Field
                              as={TextField}
                              name="nom"
                              label="Nom"
                              variant="outlined"
                              fullWidth
                              error={touched.nom && !!errors.nom}
                              helperText={touched.nom && errors.nom} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <Field
                              as={TextField}
                              name="postnom"
                              label="Postnom"
                              variant="outlined"
                              fullWidth
                              error={touched.postnom && !!errors.postnom}
                              helperText={touched.postnom && errors.postnom} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <Field
                              as={TextField}
                              name="prenom"
                              label="Prénom"
                              variant="outlined"
                              fullWidth
                              error={touched.prenom && !!errors.prenom}
                              helperText={touched.prenom && errors.prenom} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <Field
                              as={TextField}
                              name="numero"
                              label="Numéro"
                              variant="outlined"
                              fullWidth
                              error={touched.numero && !!errors.numero}
                              helperText={touched.numero && errors.numero} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <Field
                              as={TextField}
                              name="role"
                              label="Rôle"
                              select
                              variant="outlined"
                              fullWidth
                              error={touched.role && !!errors.role}
                              helperText={touched.role && errors.role}
                          >
                              <MenuItem value="Admin">Admin</MenuItem>
                              <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
                              <MenuItem value="Vendeur">Vendeur</MenuItem>
                          </Field>
                      </Grid>
                  </Grid>
                  <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ display: 'block', ml: 'auto', mt: 2 }}
                  >
                      Sauvegarder
                  </Button>
              </Form>
          )}
      </Formik></>
  );
};

export default UserForm;
