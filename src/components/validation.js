import React from 'react';
 import { Button, TextInput, View , Text} from 'react-native';
 import { Formik } from 'formik';

 
 export default  (props)  => (
   <Formik
     initialValues={{ email: '' }}
     onSubmit={values => console.log(values)}
     validationSchema={SignupSchema}
   >
     {({ handleChange, handleBlur, handleSubmit,errors,touched ,values }) => (
       <View>
         <TextInput
           onChangeText={handleChange('firstName')}
           onBlur={handleBlur('firstName')}
           value={values.firstName}
         />
         <Text>{errors.firstName && touched.firstName ? errors.firstName : null}</Text>
         <Button onPress={handleSubmit} title="Submit" />
       </View>
     )}
   </Formik>
 );